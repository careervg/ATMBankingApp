import hashlib
from decimal import Decimal, ROUND_HALF_UP

from fastapi import HTTPException, status

from app.db import repository
from app.schemas.account import (
    AccountResponse,
    BalanceResponse,
    TransactionResponse,
    TransactionsResponse,
)


def _hash_pin(pin: str) -> str:
    return hashlib.sha256(pin.encode("utf-8")).hexdigest()


def _cents_to_decimal(cents: int) -> Decimal:
    return (Decimal(cents) / Decimal(100)).quantize(Decimal("0.01"))


def _decimal_to_cents(amount: Decimal) -> int:
    normalized = amount.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    return int(normalized * 100)


def _account_response(account) -> AccountResponse:
    return AccountResponse(
        account_id=account["id"],
        customer_name=account["customer_name"],
        card_type=account["card_type"],
        balance=_cents_to_decimal(account["balance_cents"]),
    )


def authenticate_with_pin(pin: str) -> AccountResponse:
    account = repository.find_demo_account()
    if account is None or account["pin_hash"] != _hash_pin(pin):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid PIN",
        )
    return _account_response(account)


def get_balance(account_id: int) -> BalanceResponse:
    account = repository.find_account_by_id(account_id)
    if account is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found")
    return BalanceResponse(account_id=account_id, balance=_cents_to_decimal(account["balance_cents"]))


def deposit(account_id: int, amount: Decimal) -> AccountResponse:
    account = repository.find_account_by_id(account_id)
    if account is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found")

    amount_cents = _decimal_to_cents(amount)
    new_balance = account["balance_cents"] + amount_cents
    updated_account = repository.apply_money_transaction(
        account_id,
        "deposit",
        amount_cents,
        new_balance,
    )
    return _account_response(updated_account)


def withdraw(account_id: int, amount: Decimal) -> AccountResponse:
    account = repository.find_account_by_id(account_id)
    if account is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found")

    amount_cents = _decimal_to_cents(amount)
    if amount_cents > account["balance_cents"]:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Insufficient funds",
        )

    new_balance = account["balance_cents"] - amount_cents
    updated_account = repository.apply_money_transaction(
        account_id,
        "withdrawal",
        amount_cents,
        new_balance,
    )
    return _account_response(updated_account)


def get_transactions(account_id: int) -> TransactionsResponse:
    if repository.find_account_by_id(account_id) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found")

    return TransactionsResponse(
        transactions=[
            TransactionResponse(
                id=row["id"],
                type=row["type"],
                amount=_cents_to_decimal(row["amount_cents"]),
                balance_after=_cents_to_decimal(row["balance_after_cents"]),
                created_at=row["created_at"],
            )
            for row in repository.list_transactions(account_id)
        ]
    )
