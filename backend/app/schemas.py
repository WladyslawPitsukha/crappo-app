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
