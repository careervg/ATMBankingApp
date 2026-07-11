from fastapi import APIRouter

from app.schemas.account import AccountResponse, PinRequest
from app.services.accounts import authenticate_with_pin

router = APIRouter()


@router.post("/pin", response_model=AccountResponse)
def validate_pin(payload: PinRequest):
    return authenticate_with_pin(payload.pin)