import sqlite3
from contextlib import contextmanager
from pathlib import Path
from urllib.parse import urlparse

_database_path: Path | None = None


def _path_from_url(database_url: str) -> Path:
    parsed = urlparse(database_url)
    if parsed.scheme != "sqlite":
        raise ValueError("Only sqlite database URLs are supported for this demo")
    return Path(parsed.path.lstrip("/")).resolve()


def initialize_database(database_url: str) -> None:
    global _database_path
    _database_path = _path_from_url(database_url)
    _database_path.parent.mkdir(parents=True, exist_ok=True)

    with sqlite3.connect(_database_path) as connection:
        connection.execute("PRAGMA foreign_keys = ON")
        connection.executescript(
            """
            CREATE TABLE IF NOT EXISTS accounts (
                id INTEGER PRIMARY KEY,
                customer_name TEXT NOT NULL,
                pin_hash TEXT NOT NULL,
                card_type TEXT NOT NULL,
                balance_cents INTEGER NOT NULL CHECK(balance_cents >= 0),
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS transactions (
                id INTEGER PRIMARY KEY,
                account_id INTEGER NOT NULL REFERENCES accounts(id),
                type TEXT NOT NULL CHECK(type IN ('deposit', 'withdrawal')),
                amount_cents INTEGER NOT NULL CHECK(amount_cents > 0),
                balance_after_cents INTEGER NOT NULL CHECK(balance_after_cents >= 0),
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            """
        )
        seed = connection.execute("SELECT COUNT(*) FROM accounts").fetchone()[0]
        if seed == 0:
            connection.execute(
                """
                INSERT INTO accounts (id, customer_name, pin_hash, card_type, balance_cents)
                VALUES (1, 'Peter Parker', ?, 'star', 125000)
                """,
                ("03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4",),
            )
        connection.commit()


@contextmanager
def get_connection():
    if _database_path is None:
        raise RuntimeError("Database has not been initialized")
    connection = sqlite3.connect(_database_path)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    try:
        yield connection
        connection.commit()
    except Exception:
        connection.rollback()
        raise
    finally:
        connection.close()
