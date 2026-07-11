from app.db.database import get_connection


def find_account_by_id(account_id: int):
    with get_connection() as connection:
        return connection.execute(
            "SELECT * FROM accounts WHERE id = ?",
            (account_id,),
        ).fetchone()


def find_demo_account():
    with get_connection() as connection:
        return connection.execute(
            "SELECT * FROM accounts ORDER BY id LIMIT 1",
        ).fetchone()


def apply_money_transaction(
    account_id: int,
    transaction_type: str,
    amount_cents: int,
    balance_after_cents: int,
):
    with get_connection() as connection:
        connection.execute("BEGIN IMMEDIATE")
        connection.execute(
            """
            UPDATE accounts
            SET balance_cents = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            """,
            (balance_after_cents, account_id),
        )
        connection.execute(
            """
            INSERT INTO transactions (
                account_id, type, amount_cents, balance_after_cents
            )
            VALUES (?, ?, ?, ?)
            """,
            (account_id, transaction_type, amount_cents, balance_after_cents),
        )
        return connection.execute(
            "SELECT * FROM accounts WHERE id = ?",
            (account_id,),
        ).fetchone()


def list_transactions(account_id: int):
    with get_connection() as connection:
        return connection.execute(
            """
            SELECT * FROM transactions
            WHERE account_id = ?
            ORDER BY created_at DESC, id DESC
            LIMIT 25
            """,
            (account_id,),
        ).fetchall()
