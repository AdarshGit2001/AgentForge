def test_list_wallets(client):
    response = client.get("/wallets")
    assert response.status_code == 200
    assert response.json()["total"] == 4


def test_send_payment(client):
    response = client.post(
        "/wallets/send",
        json={
            "from_agent_id": 1,
            "to_agent_id": 2,
            "amount_avax": 0.01,
            "description": "Test payment",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["amount_avax"] == 0.01
    assert data["from_agent_id"] == 1
    assert data["to_agent_id"] == 2


def test_list_transactions_after_payment(client):
    client.post(
        "/wallets/send",
        json={
            "from_agent_id": 1,
            "to_agent_id": 3,
            "amount_avax": 0.02,
            "description": "Design prepayment",
        },
    )
    response = client.get("/transactions")
    assert response.status_code == 200
    assert response.json()["total"] >= 1
