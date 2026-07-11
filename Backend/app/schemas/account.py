from decimal import Decimal

from pydantic import BaseModel, Field


class PinRequest(BaseModel):
    pin: str = Field(min_length=4, max_length=8, pattern=r"^\d+$")


class MoneyRequest(BaseModel):
    amount: Decimal = Field(gt=0, max_digits=9, decimal_places=2)


class AccountResponse(BaseModel):
    account_id: int
    customer_name: str
    card_type: str
    balance: Decimal


class BalanceResponse(BaseModel):
    account_id: int
    balance: Decimal


class TransactionResponse(BaseModel):
    id: int
    type: str
    amount: Decimal
    balance_after: Decimal
    created_at: str


class TransactionsResponse(BaseModel):
    transactions: list[TransactionResponse]
