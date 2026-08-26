from fastapi.testclient import TestClient

from app.main import app


def test_application_starts() -> None:
    with TestClient(app) as client:
        assert client.app is app


def test_health_endpoint() -> None:
    with TestClient(app) as client:
        response = client.get("/api/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "agripulse-api"}


def test_domain_routes_are_available() -> None:
    modules = [
        "profiles", "farms", "crops", "disease", "market", "weather",
        "equipment", "loan", "advisory", "notifications",
    ]
    with TestClient(app) as client:
        for module in modules:
            response = client.get(f"/api/{module}/health")
            assert response.status_code == 200
            assert response.json()["module"] == module
