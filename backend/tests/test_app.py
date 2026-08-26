from copy import deepcopy
from datetime import datetime, timezone

from fastapi.testclient import TestClient

from app.core.security import AuthenticatedUser
from app.db.supabase import get_repository
from app.main import app


class FakeRepository:
    """In-memory RLS-shaped repository used without Supabase credentials."""

    def __init__(self, user_id: str = "user-a") -> None:
        self.user = AuthenticatedUser(user_id=user_id, access_token="test-token")
        self.profiles = {
            "user-a": {"id": "user-a", "full_name": "Asha", "mobile_number": None, "email": "asha@example.test", "state": "Karnataka", "district": None, "village": None, "preferred_language": "en", "farming_experience_years": None}
        }
        self.farms: dict[str, dict] = {}
        self.crops: dict[str, dict] = {}
        self.disease_scans: dict[str, dict] = {}
        self.next_id = 1

    @staticmethod
    def _equals(params: dict[str, str] | None, key: str) -> str | None:
        value = (params or {}).get(key)
        return value.removeprefix("eq.") if value else None

    async def request(self, method: str, table: str, *, params=None, json=None, return_representation=True):
        records = getattr(self, table)
        if table == "profiles":
            profile = records.get(self.user.user_id)
            if method == "GET":
                return [deepcopy(profile)] if profile else []
            if method == "PATCH" and profile:
                profile.update(json or {})
                return [deepcopy(profile)]
            return []

        record_id = self._equals(params, "id")
        farm_id = self._equals(params, "farm_id")
        rows = [row for row in records.values() if row.get("owner_id") == self.user.user_id]
        if record_id:
            rows = [row for row in rows if row["id"] == record_id]
        if farm_id:
            rows = [row for row in rows if row.get("farm_id") == farm_id]
        if method == "GET":
            return deepcopy(rows)
        if method == "POST":
            identifier = f"{table}-{self.next_id}"
            self.next_id += 1
            row = {"id": identifier, **(json or {})}
            if table == "disease_scans":
                row.setdefault("scanned_at", datetime.now(timezone.utc).isoformat())
            records[identifier] = row
            return [deepcopy(row)]
        if method == "PATCH":
            for row in rows:
                row.update(json or {})
            return deepcopy(rows)
        if method == "DELETE":
            for row in rows:
                del records[row["id"]]
            return []
        raise AssertionError(f"Unsupported request: {method} {table}")


def client_for(repository: FakeRepository) -> TestClient:
    app.dependency_overrides[get_repository] = lambda: repository
    return TestClient(app)


def teardown_function() -> None:
    app.dependency_overrides.clear()


def test_application_starts() -> None:
    with TestClient(app) as client:
        assert client.app is app


def test_health_endpoint() -> None:
    with TestClient(app) as client:
        response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "agripulse-api"}


def test_domain_routes_are_available() -> None:
    modules = ["profiles", "farms", "crops", "disease", "market", "weather", "equipment", "loan", "advisory", "notifications"]
    with TestClient(app) as client:
        for module in modules:
            response = client.get(f"/api/{module}/health")
            assert response.status_code == 200


def test_profile_requires_authentication() -> None:
    with TestClient(app) as client:
        response = client.get("/api/profiles/me")
    assert response.status_code == 401
    assert response.json()["code"] == "unauthenticated"


def test_authenticated_user_can_get_own_profile() -> None:
    with client_for(FakeRepository()) as client:
        response = client.get("/api/profiles/me", headers={"Authorization": "Bearer test-token"})
    assert response.status_code == 200
    assert response.json()["id"] == "user-a"


def test_user_can_create_and_list_own_farms() -> None:
    with client_for(FakeRepository()) as client:
        created = client.post("/api/farms", json={"name": "Home field", "state": "Karnataka"})
        farms = client.get("/api/farms")
    assert created.status_code == 201
    assert farms.status_code == 200
    assert [farm["name"] for farm in farms.json()] == ["Home field"]


def test_user_cannot_access_another_users_farm() -> None:
    repository = FakeRepository()
    repository.farms["other-farm"] = {"id": "other-farm", "owner_id": "user-b", "name": "Private farm", "land_unit": "acre"}
    with client_for(repository) as client:
        response = client.get("/api/farms/other-farm")
    assert response.status_code == 404


def test_user_can_create_crop_only_under_own_farm() -> None:
    repository = FakeRepository()
    repository.farms["farm-1"] = {"id": "farm-1", "owner_id": "user-a", "name": "Home field", "land_unit": "acre"}
    with client_for(repository) as client:
        response = client.post("/api/farms/farm-1/crops", json={"name": "Tomato", "growth_stage": "flowering"})
    assert response.status_code == 201
    assert response.json()["farm_id"] == "farm-1"


def test_user_cannot_access_another_users_farm_or_crops() -> None:
    repository = FakeRepository()
    repository.farms["other-farm"] = {"id": "other-farm", "owner_id": "user-b", "name": "Private farm", "land_unit": "acre"}
    repository.crops["other-crop"] = {"id": "other-crop", "owner_id": "user-b", "farm_id": "other-farm", "name": "Potato", "growth_stage": "sowing", "health_status": "healthy"}
    with client_for(repository) as client:
        response = client.get("/api/farms/other-farm/crops/other-crop")
    assert response.status_code == 404


def test_disease_analysis_requires_authentication() -> None:
    with TestClient(app) as client:
        response = client.post("/api/disease/analyze", json={"crop_id": "crop-1", "image_reference": "browser-preview://selected-image"})
    assert response.status_code == 401


def test_disease_analysis_rejects_unowned_crop() -> None:
    repository = FakeRepository()
    repository.crops["other-crop"] = {"id": "other-crop", "owner_id": "user-b", "farm_id": "other-farm", "name": "Tomato", "growth_stage": "sowing", "health_status": "healthy"}
    with client_for(repository) as client:
        response = client.post("/api/disease/analyze", json={"crop_id": "other-crop", "image_reference": "browser-preview://selected-image"})
    assert response.status_code == 404


def test_disease_analysis_rejects_crop_farm_mismatch() -> None:
    repository = FakeRepository()
    repository.farms["farm-1"] = {"id": "farm-1", "owner_id": "user-a", "name": "Home field", "land_unit": "acre"}
    repository.farms["farm-2"] = {"id": "farm-2", "owner_id": "user-a", "name": "River field", "land_unit": "acre"}
    repository.crops["crop-1"] = {"id": "crop-1", "owner_id": "user-a", "farm_id": "farm-1", "name": "Tomato", "growth_stage": "flowering", "health_status": "healthy"}
    with client_for(repository) as client:
        response = client.post("/api/disease/analyze", json={"crop_id": "crop-1", "farm_id": "farm-2", "image_reference": "browser-preview://selected-image"})
    assert response.status_code == 422


def test_authenticated_disease_analysis_creates_placeholder_scan() -> None:
    repository = FakeRepository()
    repository.farms["farm-1"] = {"id": "farm-1", "owner_id": "user-a", "name": "Home field", "land_unit": "acre"}
    repository.crops["crop-1"] = {"id": "crop-1", "owner_id": "user-a", "farm_id": "farm-1", "name": "Tomato", "growth_stage": "flowering", "health_status": "healthy"}
    with client_for(repository) as client:
        response = client.post("/api/disease/analyze", json={"crop_id": "crop-1", "farm_id": "farm-1", "image_reference": "browser-preview://selected-image"})
    assert response.status_code == 201
    body = response.json()
    assert body["crop"] == "Tomato"
    assert body["model_version"] == "placeholder-v0"
    assert body["status"] == "placeholder"
    assert len(repository.disease_scans) == 1
