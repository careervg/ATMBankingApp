def test_pin_authentication_success(client):
    response = client.post("/api/v1/auth/pin", json={"pin": "1234"})

    assert response.status_code == 200
    payload = response.json()
    assert payload["customer_name"] == "Peter Parker"
    assert payload["card_type"] == "star"
    assert payload["balance"] == "1250.00"


def test_pin_authentication_failure(client):
    response = client.post("/api/v1/auth/pin", json={"pin": "9999"})

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid PIN"


def test_deposit_persists_balance(client):
    response = client.post("/api/v1/accounts/1/deposit", json={"amount": "25.50"})

    assert response.status_code == 200
    assert response.json()["balance"] == "1275.50"

    balance = client.get("/api/v1/accounts/1/balance")
    assert balance.json()["balance"] == "1275.50"


def test_withdraw_records_transaction(client):
    response = client.post("/api/v1/accounts/1/withdraw", json={"amount": "100.00"})

    assert response.status_code == 200
    assert response.json()["balance"] == "1150.00"

    transactions = client.get("/api/v1/accounts/1/transactions").json()["transactions"]
    assert transactions[0]["type"] == "withdrawal"
    assert transactions[0]["amount"] == "100.00"
    assert transactions[0]["balance_after"] == "1150.00"


def test_withdraw_rejects_insufficient_funds(client):
    response = client.post("/api/v1/accounts/1/withdraw", json={"amount": "5000.00"})

    assert response.status_code == 409
    assert response.json()["detail"] == "Insufficient funds"
