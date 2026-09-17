import sqlite3

from app.migrations import apply_migrations


def test_auth_migration_upgrades_a_legacy_database(tmp_path):
    database_path = tmp_path / "legacy.db"
    with sqlite3.connect(database_path) as connection:
        connection.execute("CREATE TABLE users (id INTEGER PRIMARY KEY, email VARCHAR(255) NOT NULL, password_hash VARCHAR(255) NOT NULL, created_at DATETIME NOT NULL)")
        connection.commit()

    apply_migrations(str(database_path))

    with sqlite3.connect(database_path) as connection:
        columns = {row[1] for row in connection.execute("PRAGMA table_info(users)")}
        tables = {row[0] for row in connection.execute("SELECT name FROM sqlite_master WHERE type='table'")}

    assert {"is_verified", "role", "verification_token", "reset_token", "reset_token_expires_at"}.issubset(columns)
    assert {"user_sessions", "watchlist_items"}.issubset(tables)