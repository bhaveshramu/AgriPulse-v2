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
        self.market_data: dict[str, dict] = {}
        self.weather_data: dict[str, dict] = {}
        self.equipment: dict[str, dict] = {}
        self.equipment_bookings: dict[str, dict] = {}
        self.loan_assessments: dict[str, dict] = {}
        self.advisories: dict[str, dict] = {}
        self.notifications: dict[str, dict] = {}
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
        public_read_tables = {"market_data", "weather_data", "advisories", "equipment"}
        owner_field = {"equipment_bookings": "renter_id", "loan_assessments": "user_id", "notifications": "user_id"}.get(table, "owner_id")
        rows = list(records.values()) if table in public_read_tables and method == "GET" else [row for row in records.values() if row.get(owner_field) == self.user.user_id]
        if record_id:
            rows = [row for row in rows if row["id"] == record_id]
        if farm_id:
            rows = [row for row in rows if row.get("farm_id") == farm_id]
        for key in ("crop_name", "state", "district", "market_name", "latitude", "longitude", "category"):
            expected = self._equals(params, key)
            if expected is not None:
                rows = [row for row in rows if str(row.get(key)) == expected]
        if method == "GET":
            return deepcopy(rows)
        if method == "POST":
            identifier = f"{table}-{self.next_id}"
            self.next_id += 1
            row = {"id": identifier, **(json or {})}
            if table == "disease_scans":
                row.setdefault("scanned_at", datetime.now(timezone.utc).isoformat())
            if table == "equipment":
                row.setdefault("rating", 0)
            if table == "equipment_bookings":
                row.setdefault("status", "pending")
            if table == "loan_assessments":
                row.setdefault("created_at", datetime.now(timezone.utc).isoformat())
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


def test_market_retrieval_requires_authentication() -> None:
    with TestClient(app) as client:
        response = client.get("/api/market")
    assert response.status_code == 401


def test_authenticated_market_retrieval_and_filtering() -> None:
    repository = FakeRepository()
    repository.market_data = {
        "market-1": {"id": "market-1", "crop_name": "Tomato", "state": "Karnataka", "district": "Mysuru", "market_name": "Mysuru Mandi", "price_date": "2026-08-01", "min_price": 1000, "max_price": 1500, "modal_price": 1200, "source": "demo"},
        "market-2": {"id": "market-2", "crop_name": "Potato", "state": "Karnataka", "district": "Mysuru", "market_name": "Mysuru Mandi", "price_date": "2026-08-01", "min_price": 800, "max_price": 1100, "modal_price": 900, "source": "demo"},
    }
    with client_for(repository) as client:
        response = client.get("/api/market?crop_name=Tomato&state=Karnataka")
    assert response.status_code == 200
    assert [row["id"] for row in response.json()] == ["market-1"]


def test_weather_retrieval_requires_authentication() -> None:
    with TestClient(app) as client:
        response = client.get("/api/weather")
    assert response.status_code == 401


def test_authenticated_weather_retrieval_and_filtering() -> None:
    repository = FakeRepository()
    repository.weather_data = {
        "weather-1": {"id": "weather-1", "farm_id": None, "location_name": "Mysuru, Karnataka", "recorded_for": "2026-08-01", "temperature_c": 28, "humidity_percent": 65, "wind_speed_kmph": 10, "rain_probability_percent": 30, "rainfall_mm": 0, "condition": "Cloudy", "state": "Karnataka", "district": "Mysuru", "latitude": 12.3, "longitude": 76.6, "forecast_time": None, "source": "demo"},
        "weather-2": {"id": "weather-2", "farm_id": None, "location_name": "Pune, Maharashtra", "recorded_for": "2026-08-01", "temperature_c": 30, "humidity_percent": 50, "wind_speed_kmph": 8, "rain_probability_percent": 10, "rainfall_mm": 0, "condition": "Clear", "state": "Maharashtra", "district": "Pune", "latitude": 18.5, "longitude": 73.8, "forecast_time": None, "source": "demo"},
    }
    with client_for(repository) as client:
        response = client.get("/api/weather?state=Karnataka&district=Mysuru")
    assert response.status_code == 200
    assert [row["id"] for row in response.json()] == ["weather-1"]


def test_equipment_discovery_and_owner_protection() -> None:
    repository = FakeRepository()
    repository.equipment["equipment-1"] = {"id": "equipment-1", "owner_id": "user-b", "title": "Tractor", "category": "tractor", "description": None, "hourly_price": 500, "state": "Karnataka", "district": "Mysuru", "village": None, "is_available": True, "rating": 4.5}
    with client_for(repository) as client:
        discovered = client.get("/api/equipment")
        update = client.patch("/api/equipment/equipment-1", json={"title": "Changed"})
    assert discovered.status_code == 200
    assert discovered.json()[0]["title"] == "Tractor"
    assert update.status_code == 404


def test_equipment_booking_authorization() -> None:
    repository = FakeRepository()
    repository.equipment["equipment-1"] = {"id": "equipment-1", "owner_id": "user-b", "title": "Tractor", "category": "tractor", "description": None, "hourly_price": 500, "state": None, "district": None, "village": None, "is_available": True, "rating": 0}
    repository.equipment_bookings["booking-other"] = {"id": "booking-other", "equipment_id": "equipment-1", "renter_id": "user-b", "start_date": "2026-08-01", "end_date": None, "hours": 2, "total_amount": 1000, "status": "pending"}
    with client_for(repository) as client:
        created = client.post("/api/equipment/equipment-1/bookings", json={"hours": 3})
        denied = client.patch("/api/equipment/bookings/booking-other", json={"status": "cancelled"})
    assert created.status_code == 201
    assert created.json()["total_amount"] == 1500
    assert denied.status_code == 404


def test_loan_assessment_creation_and_retrieval() -> None:
    with client_for(FakeRepository()) as client:
        created = client.post("/api/loan/assess", json={"land_area": 2, "primary_crop": "Tomato", "annual_income": 150000, "farming_experience_years": 5, "irrigation_available": True})
        listed = client.get("/api/loan/assessments")
    assert created.status_code == 201
    assert "not a loan approval" in created.json()["result_summary"]
    assert len(listed.json()) == 1


def test_advisory_retrieval_and_filtering() -> None:
    repository = FakeRepository()
    repository.advisories = {"advisory-1": {"id": "advisory-1", "title": "Tomato care", "body": "Check leaves", "category": "crop", "crop_name": "Tomato", "language": "en", "is_demo": True, "state": "Karnataka", "district": "Mysuru"}, "advisory-2": {"id": "advisory-2", "title": "Potato care", "body": "Check soil", "category": "crop", "crop_name": "Potato", "language": "en", "is_demo": True, "state": "Karnataka", "district": "Mysuru"}}
    with client_for(repository) as client:
        response = client.get("/api/advisory?crop_name=Tomato&state=Karnataka")
    assert response.status_code == 200
    assert [row["id"] for row in response.json()] == ["advisory-1"]


def test_notification_ownership_and_read_operation() -> None:
    repository = FakeRepository()
    repository.notifications = {"notification-1": {"id": "notification-1", "user_id": "user-a", "title": "Weather", "message": "Rain expected", "type": "info", "is_read": False, "created_at": "2026-08-01T00:00:00Z"}, "notification-other": {"id": "notification-other", "user_id": "user-b", "title": "Private", "message": "Only B", "type": "info", "is_read": False, "created_at": "2026-08-01T00:00:00Z"}}
    with client_for(repository) as client:
        listed = client.get("/api/notifications")
        read = client.patch("/api/notifications/notification-1/read")
        denied = client.patch("/api/notifications/notification-other/read")
    assert [row["id"] for row in listed.json()] == ["notification-1"]
    assert read.status_code == 200 and read.json()["is_read"] is True
    assert denied.status_code == 404


def test_part_2e_endpoints_require_authentication() -> None:
    with TestClient(app) as client:
        assert client.get("/api/equipment").status_code == 401
        assert client.get("/api/equipment/equipment-1/bookings").status_code == 401
        assert client.post("/api/loan/assess", json={"land_area": 1, "primary_crop": "Tomato", "annual_income": 1, "farming_experience_years": 1}).status_code == 401
        assert client.get("/api/advisory").status_code == 401
        assert client.get("/api/notifications").status_code == 401
