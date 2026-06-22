def test_list_agents(client):
    response = client.get("/agents")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 4
    roles = {agent["role"] for agent in data["agents"]}
    assert roles == {"manager", "research", "design", "developer"}


def test_get_manager_agent(client):
    response = client.get("/agents/1")
    assert response.status_code == 200
    data = response.json()
    assert data["role"] == "manager"
    assert data["balance"] == 1.0


def test_list_services(client):
    response = client.get("/services")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 7


def test_create_service(client):
    response = client.post(
        "/services",
        json={
            "name": "Custom Research",
            "description": "Test service",
            "price_avax": 0.015,
            "agent_id": 2,
            "category": "research",
        },
    )
    assert response.status_code == 201
    assert response.json()["name"] == "Custom Research"
