-- Apply once to databases created before the auth/session model changes.
ALTER TABLE users ADD COLUMN is_verified BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE users ADD COLUMN role VARCHAR(30) NOT NULL DEFAULT 'user';
ALTER TABLE users ADD COLUMN verification_token VARCHAR(128);
ALTER TABLE users ADD COLUMN reset_token VARCHAR(128);
ALTER TABLE users ADD COLUMN reset_token_expires_at DATETIME;

CREATE UNIQUE INDEX IF NOT EXISTS ix_users_verification_token ON users (verification_token);
CREATE UNIQUE INDEX IF NOT EXISTS ix_users_reset_token ON users (reset_token);

CREATE TABLE IF NOT EXISTS user_sessions (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    token_id VARCHAR(64) NOT NULL UNIQUE,
    token_type VARCHAR(20) NOT NULL,
    expires_at DATETIME NOT NULL,
    revoked_at DATETIME,
    created_at DATETIME NOT NULL
);

CREATE INDEX IF NOT EXISTS ix_user_sessions_user_id ON user_sessions (user_id);
CREATE INDEX IF NOT EXISTS ix_user_sessions_token_id ON user_sessions (token_id);

CREATE TABLE IF NOT EXISTS watchlist_items (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    coin_id VARCHAR(50) NOT NULL,
    created_at DATETIME NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS ix_watchlist_user_coin ON watchlist_items (user_id, coin_id);