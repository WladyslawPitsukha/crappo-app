from __future__ import annotations

from typing import Any

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .auth import create_access_token, get_current_user, get_password_hash, verify_password
from .database import Base, engine, get_db
from .models import PortfolioHolding, PortfolioTransaction, User
from .schemas import MarketCoin, MarketResponse, PortfolioEntry, PortfolioResponse, PortfolioTransactionResponse, TokenResponse, UserLoginRequest, UserProfile, UserRegisterRequest

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Crappo API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/auth/register", response_model=TokenResponse)
def register_user(payload: UserRegisterRequest, db: Session = Depends(get_db)) -> TokenResponse:
    existing_user = db.query(User).filter(User.email == payload.email.lower()).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists")

    user = User(email=payload.email.lower(), password_hash=get_password_hash(payload.password))
    db.add(user)
    db.commit()
    db.refresh(user)

    return TokenResponse(access_token=create_access_token(user.id), token_type="bearer")


@app.post("/auth/login", response_model=TokenResponse)
def login_user(payload: UserLoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")

    return TokenResponse(access_token=create_access_token(user.id), token_type="bearer")


@app.get("/auth/profile", response_model=UserProfile)
def get_user_profile(current_user: User = Depends(get_current_user)) -> UserProfile:
    return UserProfile(id=current_user.id, email=current_user.email)


@app.get("/market", response_model=MarketResponse)
def get_market() -> MarketResponse:
    mock_data = [
        {"symbol": "BTC", "name": "Bitcoin", "price": 77191.0, "change_24h": 3.4, "volume_24h": 16800000000},
        {"symbol": "ETH", "name": "Ethereum", "price": 2522.51, "change_24h": 1.8, "volume_24h": 9120000000},
        {"symbol": "LTC", "name": "Litecoin", "price": 53.66, "change_24h": 0.18, "volume_24h": 154760000},
        {"symbol": "SOL", "name": "Solana", "price": 161.2, "change_24h": -0.8, "volume_24h": 2130000000},
    ]
    return MarketResponse(coins=[MarketCoin(**coin) for coin in mock_data])


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
    payload: dict[str, Any],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> PortfolioEntry:
    symbol = str(payload["symbol"]).upper()
    name = str(payload.get("name", symbol))
    quantity = float(payload["quantity"])
    average_cost = float(payload["average_cost"])
    replace_holding = bool(payload.get("replace", False))

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
    payload: dict[str, Any],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> PortfolioTransactionResponse:
    symbol = str(payload["symbol"]).upper()
    tx_type = str(payload["type"]).lower()
    quantity = float(payload["quantity"])
    price_per_coin = float(payload["price_per_coin"])
    total_value = float(payload["total_value"])

    if tx_type not in {"buy", "sell"}:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Type must be buy or sell")

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
