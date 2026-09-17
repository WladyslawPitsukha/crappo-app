from __future__ import annotations

import os
from dataclasses import dataclass


@dataclass(frozen=True)
class Settings:
    app_env: str = os.getenv("APP_ENV", "development")
    jwt_secret_key: str = os.getenv("JWT_SECRET_KEY", "dev-secret-key-change-me")
    jwt_algorithm: str = os.getenv("JWT_ALGORITHM", "HS256")
    access_token_minutes: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "15"))
    refresh_token_days: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "30"))
    cookie_secure: bool = os.getenv("COOKIE_SECURE", "false").lower() == "true"
    cookie_domain: str | None = os.getenv("COOKIE_DOMAIN") or None
    frontend_url: str = os.getenv("FRONTEND_URL", "http://localhost:3000")
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./crappo.db")
    smtp_host: str | None = os.getenv("SMTP_HOST") or None
    smtp_port: int = int(os.getenv("SMTP_PORT", "587"))
    smtp_username: str | None = os.getenv("SMTP_USERNAME") or None
    smtp_password: str | None = os.getenv("SMTP_PASSWORD") or None
    mail_from: str = os.getenv("MAIL_FROM", "noreply@crappo.local")
    sentry_dsn: str | None = os.getenv("SENTRY_DSN") or None


settings = Settings()


def validate_settings() -> None:
    if settings.app_env == "production":
        if settings.jwt_secret_key == "dev-secret-key-change-me":
            raise RuntimeError("JWT_SECRET_KEY must be configured in production")
        if not settings.cookie_secure:
            raise RuntimeError("COOKIE_SECURE must be true in production")
        if settings.frontend_url.startswith("http://localhost"):
            raise RuntimeError("FRONTEND_URL must be configured in production")