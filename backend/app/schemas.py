from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field


class UserRegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)


class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenRequest(BaseModel):
    refresh_token: str


class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    token: str
    password: str = Field(min_length=8)


class PortfolioHoldingRequest(BaseModel):
    symbol: str = Field(min_length=2, max_length=20)
    name: str = Field(min_length=1, max_length=100)
    quantity: float = Field(ge=0)
    average_cost: float = Field(ge=0)
    replace: bool = False


class PortfolioTransactionRequest(BaseModel):
    symbol: str = Field(min_length=2, max_length=20)
    type: Literal["buy", "sell"]
    quantity: float = Field(gt=0)
    price_per_coin: float = Field(gt=0)
    total_value: float = Field(gt=0)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class PortfolioEntry(BaseModel):
    symbol: str
    name: str
    quantity: float
    average_cost: float
    value: float | None = None


class PortfolioTransactionResponse(BaseModel):
    id: int
    symbol: str
    type: Literal["buy", "sell"]
    quantity: float
    price_per_coin: float
    total_value: float
    created_at: datetime


class PortfolioResponse(BaseModel):
    total_value: float
    holdings: list[PortfolioEntry]
    transactions: list[PortfolioTransactionResponse]


class MarketCoin(BaseModel):
    symbol: str
    name: str
    price: float
    change_24h: float
    volume_24h: float


class MarketResponse(BaseModel):
    coins: list[MarketCoin]


class UserProfile(BaseModel):
    id: int
    email: str
    is_verified: bool = False
    role: str = "user"


class WatchlistItemRequest(BaseModel):
    coin_id: str = Field(min_length=2, max_length=50)


class WatchlistResponse(BaseModel):
    coin_ids: list[str]
