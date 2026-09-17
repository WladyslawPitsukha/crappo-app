from __future__ import annotations

from datetime import datetime, timedelta, timezone
import json
from secrets import token_urlsafe
from urllib.error import URLError
from urllib.request import urlopen
from uuid import uuid4

import jwt
from fastapi import Cookie, Depends, FastAPI, HTTPException, Response, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .auth import ALGORITHM, SECRET_KEY, ACCESS_TOKEN_EXPIRE_MINUTES, REFRESH_TOKEN_EXPIRE_DAYS, create_access_token, get_current_user, get_password_hash, verify_password
from .config import settings
from .database import Base, engine, get_db
from .mailer import send_email
from .models import PortfolioHolding, PortfolioTransaction, User, UserSession, WatchlistItem
from .schemas import MarketCoin, MarketResponse, PasswordResetConfirm, PasswordResetRequest, PortfolioEntry, PortfolioHoldingRequest, PortfolioResponse, PortfolioTransactionRequest, PortfolioTransactionResponse, TokenResponse, UserLoginRequest, UserProfile, UserRegisterRequest, WatchlistItemRequest, WatchlistResponse

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Crappo API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


def set_auth_cookies(response: Response, user_id: int, db: Session) -> TokenResponse:
    access_id = uuid4().hex
    refresh_id = uuid4().hex
    access_token = create_access_token(user_id, "access", access_id)
    refresh_token = create_access_token(user_id, "refresh", refresh_id)
    now = datetime.utcnow()
    db.add_all([
        UserSession(user_id=user_id, token_id=access_id, token_type="access", expires_at=now + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)),
        UserSession(user_id=user_id, token_id=refresh_id, token_type="refresh", expires_at=now + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)),
    ])
    db.commit()
    cookie_options = {"httponly": True, "secure": settings.cookie_secure, "samesite": "lax", "domain": settings.cookie_domain}
    response.set_cookie("crappo_access", access_token, max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60, **cookie_options)
    response.set_cookie("crappo_refresh", refresh_token, max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60, **cookie_options)
    return TokenResponse(access_token=access_token, token_type="bearer")


@app.post("/auth/register", response_model=TokenResponse)
def register_user(payload: UserRegisterRequest, response: Response, db: Session = Depends(get_db)) -> TokenResponse:
    existing_user = db.query(User).filter(User.email == payload.email.lower()).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists")

    user = User(email=payload.email.lower(), password_hash=get_password_hash(payload.password), verification_token=token_urlsafe(32))
    db.add(user)
    db.commit()
    db.refresh(user)

    send_email(payload.email, "Verify your Crappo account", f"Verify your account: {settings.frontend_url}/verify/{user.verification_token}")
    return set_auth_cookies(response, user.id, db)


@app.post("/auth/login", response_model=TokenResponse)
def login_user(payload: UserLoginRequest, response: Response, db: Session = Depends(get_db)) -> TokenResponse:
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")

    return set_auth_cookies(response, user.id, db)


@app.post("/auth/refresh", response_model=TokenResponse)
def refresh_session(response: Response, refresh_token: str | None = Cookie(default=None), db: Session = Depends(get_db)) -> TokenResponse:
    if not refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh session missing")
    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "refresh":
            raise ValueError("Invalid token type")
        user_id = int(payload["sub"])
    except (jwt.PyJWTError, KeyError, TypeError, ValueError) as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh session") from exc
    session = db.query(UserSession).filter(UserSession.token_id == payload.get("jti")).first()
    if session is None or session.revoked_at is not None or session.expires_at < datetime.utcnow() or db.query(User).filter(User.id == user_id).first() is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    session.revoked_at = datetime.utcnow()
    db.commit()
    return set_auth_cookies(response, user_id, db)


@app.post("/auth/logout")
def logout(response: Response, access_token: str | None = Cookie(default=None), refresh_token: str | None = Cookie(default=None), db: Session = Depends(get_db)) -> dict[str, str]:
    for token in (access_token, refresh_token):
        if token:
            try:
                payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM], options={"verify_exp": False})
                session = db.query(UserSession).filter(UserSession.token_id == payload.get("jti")).first()
                if session:
                    session.revoked_at = datetime.utcnow()
            except jwt.PyJWTError:
                pass
    db.commit()
    response.delete_cookie("crappo_access")
    response.delete_cookie("crappo_refresh")
    return {"status": "ok"}


@app.get("/auth/verify/{token}")
def verify_email(token: str, db: Session = Depends(get_db)) -> dict[str, str]:
    user = db.query(User).filter(User.verification_token == token).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid verification token")
    user.is_verified = True
    user.verification_token = None
    db.commit()
    return {"status": "verified"}


@app.post("/auth/password-reset/request")
def request_password_reset(payload: PasswordResetRequest, db: Session = Depends(get_db)) -> dict[str, str]:
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if user:
        user.reset_token = token_urlsafe(32)
        user.reset_token_expires_at = datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(minutes=30)
        db.commit()
        send_email(payload.email, "Reset your Crappo password", f"Reset your password: {settings.frontend_url}/reset-password/{user.reset_token}")
    return {"message": "If the account exists, password reset instructions have been sent."}


@app.post("/auth/password-reset/confirm")
def confirm_password_reset(payload: PasswordResetConfirm, db: Session = Depends(get_db)) -> dict[str, str]:
    user = db.query(User).filter(User.reset_token == payload.token).first()
    if user is None or user.reset_token_expires_at is None or user.reset_token_expires_at < datetime.utcnow():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired reset token")
    user.password_hash = get_password_hash(payload.password)
    user.reset_token = None
    user.reset_token_expires_at = None
    db.commit()
    return {"status": "password-updated"}


@app.get("/auth/profile", response_model=UserProfile)
def get_user_profile(current_user: User = Depends(get_current_user)) -> UserProfile:
    return UserProfile(id=current_user.id, email=current_user.email, is_verified=current_user.is_verified, role=current_user.role)


@app.get("/market", response_model=MarketResponse)
def get_market() -> MarketResponse:
    url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,litecoin&price_change_percentage=24h"
    try:
        with urlopen(url, timeout=8) as response:
            upstream_data = json.load(response)
    except (OSError, URLError) as exc:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Market provider unavailable") from exc

    names = {"bitcoin": "Bitcoin", "ethereum": "Ethereum", "litecoin": "Litecoin"}
    coins = [MarketCoin(
        symbol=item["symbol"].upper(),
        name=names[item["id"]],
        price=item["current_price"],
        change_24h=item.get("price_change_percentage_24h") or 0,
        volume_24h=item.get("total_volume") or 0,
    ) for item in upstream_data if item["id"] in names]
    return MarketResponse(coins=coins)


@app.get("/market/history/{coin_id}")
def get_market_history(coin_id: str, days: int = 7) -> dict[str, list[list[float]]]:
    if coin_id not in {"bitcoin", "ethereum", "litecoin"} or days not in {1, 7, 30, 365}:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported coin or range")
    url = f"https://api.coingecko.com/api/v3/coins/{coin_id}/market_chart?vs_currency=usd&days={days}"
    try:
        with urlopen(url, timeout=8) as response:
            data = json.load(response)
    except (OSError, URLError) as exc:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Market provider unavailable") from exc
    return {"prices": data.get("prices", [])}


@app.get("/watchlist", response_model=WatchlistResponse)
def get_watchlist(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> WatchlistResponse:
    items = db.query(WatchlistItem).filter(WatchlistItem.user_id == current_user.id).order_by(WatchlistItem.created_at.asc()).all()
    return WatchlistResponse(coin_ids=[item.coin_id for item in items])


@app.post("/watchlist", response_model=WatchlistResponse)
def add_watchlist_item(payload: WatchlistItemRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> WatchlistResponse:
    coin_id = payload.coin_id.lower()
    existing = db.query(WatchlistItem).filter(WatchlistItem.user_id == current_user.id, WatchlistItem.coin_id == coin_id).first()
    if existing is None:
        db.add(WatchlistItem(user_id=current_user.id, coin_id=coin_id))
        db.commit()
    return get_watchlist(current_user, db)


@app.delete("/watchlist/{coin_id}", response_model=WatchlistResponse)
def remove_watchlist_item(coin_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> WatchlistResponse:
    item = db.query(WatchlistItem).filter(WatchlistItem.user_id == current_user.id, WatchlistItem.coin_id == coin_id.lower()).first()
    if item:
        db.delete(item)
        db.commit()
    return get_watchlist(current_user, db)


@app.get("/market/insights")
def get_market_insights() -> dict[str, list[dict[str, str | float]]]:
    return {
        "movers": [
            {"symbol": "BTC", "name": "Bitcoin", "change": 3.4},
            {"symbol": "ETH", "name": "Ethereum", "change": 1.8},
            {"symbol": "LTC", "name": "Litecoin", "change": 0.18},
        ],
        "news": [
            {"title": "Crypto markets remain active as volume rises", "source": "Crappo Markets", "sentiment": "positive"},
            {"title": "Investors watch liquidity and macro signals", "source": "Market Brief", "sentiment": "neutral"},
        ],
    }


@app.get("/portfolio", response_model=PortfolioResponse)
def get_portfolio(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> PortfolioResponse:
    holdings = db.query(PortfolioHolding).filter(PortfolioHolding.user_id == current_user.id).all()
    transactions = db.query(PortfolioTransaction).filter(PortfolioTransaction.user_id == current_user.id).order_by(PortfolioTransaction.created_at.desc()).all()

    portfolio_holdings: list[PortfolioEntry] = []
    total_value = 0.0

    for holding in holdings:
        value = holding.quantity * holding.average_cost
        total_value += value
        portfolio_holdings.append(
            PortfolioEntry(
                symbol=holding.symbol,
                name=holding.name,
                quantity=holding.quantity,
                average_cost=holding.average_cost,
                value=value,
            )
        )

    transaction_items = [
        PortfolioTransactionResponse(
            id=tx.id,
            symbol=tx.symbol,
            type=tx.type,
            quantity=tx.quantity,
            price_per_coin=tx.price_per_coin,
            total_value=tx.total_value,
            created_at=tx.created_at,
        )
        for tx in transactions
    ]

    return PortfolioResponse(total_value=total_value, holdings=portfolio_holdings, transactions=transaction_items)


@app.post("/portfolio/holdings", response_model=PortfolioEntry)
def upsert_holding(
    payload: PortfolioHoldingRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> PortfolioEntry:
    symbol = payload.symbol.upper()
    name = payload.name
    quantity = payload.quantity
    average_cost = payload.average_cost
    replace_holding = payload.replace

    holding = (
        db.query(PortfolioHolding)
        .filter(PortfolioHolding.user_id == current_user.id, PortfolioHolding.symbol == symbol)
        .first()
    )

    if holding is None:
        holding = PortfolioHolding(
            user_id=current_user.id,
            symbol=symbol,
            name=name,
            quantity=quantity,
            average_cost=average_cost,
        )
        db.add(holding)
    elif replace_holding:
        holding.quantity = quantity
        holding.average_cost = average_cost
        holding.name = name
    else:
        total_quantity = holding.quantity + quantity
        existing_cost = holding.average_cost * holding.quantity
        new_cost = average_cost * quantity
        holding.quantity = total_quantity
        holding.average_cost = (existing_cost + new_cost) / total_quantity if total_quantity else 0
        holding.name = name

    db.commit()
    db.refresh(holding)

    return PortfolioEntry(
        symbol=holding.symbol,
        name=holding.name,
        quantity=holding.quantity,
        average_cost=holding.average_cost,
        value=holding.quantity * holding.average_cost,
    )


@app.post("/portfolio/transactions", response_model=PortfolioTransactionResponse)
def create_transaction(
    payload: PortfolioTransactionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> PortfolioTransactionResponse:
    symbol = payload.symbol.upper()
    tx_type = payload.type
    quantity = payload.quantity
    price_per_coin = payload.price_per_coin
    total_value = payload.total_value

    holding = db.query(PortfolioHolding).filter(PortfolioHolding.user_id == current_user.id, PortfolioHolding.symbol == symbol).first()
    if tx_type == "sell" and (holding is None or holding.quantity < quantity):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Insufficient holdings")

    tx = PortfolioTransaction(
        user_id=current_user.id,
        symbol=symbol,
        type=tx_type,
        quantity=quantity,
        price_per_coin=price_per_coin,
        total_value=total_value,
    )
    db.add(tx)
    db.commit()
    db.refresh(tx)

    return PortfolioTransactionResponse(
        id=tx.id,
        symbol=tx.symbol,
        type=tx.type,
        quantity=tx.quantity,
        price_per_coin=tx.price_per_coin,
        total_value=tx.total_value,
        created_at=tx.created_at,
    )
