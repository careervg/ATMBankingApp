from fastapi import APIRouter

from app.schemas.account import (
    AccountResponse,
    BalanceResponse,
    MoneyRequest,
    TransactionsResponse,
)
from app.services.accounts import deposit, get_balance, get_transactions, withdraw

router = APIRouter()


@router.get("/{account_id}/balance", response_model=BalanceResponse)
def account_balance(account_id: int):
    return get_balance(account_id)


@router.post("/{account_id}/deposit", response_model=AccountResponse)
def deposit_funds(account_id: int, payload: MoneyRequest):
    return deposit(account_id, payload.amount)


@router.post("/{account_id}/withdraw", response_model=AccountResponse)
def withdraw_funds(account_id: int, payload: MoneyRequest):
    return withdraw(account_id, payload.amount)


@router.get("/{account_id}/transactions", response_model=TransactionsResponse)
def account_transactions(account_id: int):
    return get_transactions(account_id)
