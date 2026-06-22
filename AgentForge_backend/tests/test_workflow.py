def test_demo_startup_plan(client):
    response = client.post(
        "/demo/startup-plan",
        json={"prompt": "Build a startup plan for an AI tutoring app"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["total_cost_avax"] > 0
    assert len(data["payments"]) >= 1


def test_get_workflow(client):
    start_response = client.post(
        "/demo/logo-generation",
        json={"company_name": "TestCo", "industry": "EdTech"},
    )
    assert start_response.status_code == 200
    workflow_id = start_response.json()["workflow_id"]

    response = client.get(f"/workflow/{workflow_id}")
    assert response.status_code == 200
    assert response.json()["status"] == "completed"
