from __future__ import annotations

import sqlite3
from pathlib import Path


MIGRATIONS_DIR = Path(__file__).resolve().parents[1] / "migrations"


def apply_migrations(database_path: str) -> None:
    migration_files = sorted(MIGRATIONS_DIR.glob("*.sql"))
    with sqlite3.connect(database_path) as connection:
        has_users_table = connection.execute("SELECT 1 FROM sqlite_master WHERE type='table' AND name='users'").fetchone()
        if not has_users_table:
            return
        for migration_file in migration_files:
            statements = migration_file.read_text(encoding="utf-8").split(";")
            for statement in statements:
                cleaned = "\n".join(line for line in statement.splitlines() if not line.strip().startswith("--")).strip()
                if cleaned:
                    connection.execute(cleaned)
        connection.commit()


if __name__ == "__main__":
    import os
    apply_migrations(os.getenv("DATABASE_PATH", "crappo.db"))