import json

import pytest

from www import create_app


@pytest.fixture
def app():
    app = create_app({"TESTING": True})
    return app


def test_hello(app):
    response = app.test_client().get("/")
    assert response.status_code == 200
    assert response.data == b"Hello, starbug navigator!"


def test_api(app):
    response = app.test_client().get("/api/")
    assert response.status_code == 200
    assert response.data == b"Hello, starbug API!"


def test_api_timezones(app):
    response = app.test_client().get("/api/timezones")
    assert response.status_code == 200
    assert isinstance(json.loads(response.data), list)


class TestJulianDateAPI:

    def test_valid_julian_date(self, app):
        response = app.test_client().post(
            "/api/julian_date", json={"julian_day": 2451545.0}
        )
        assert response.status_code == 200
        data = json.loads(response.data)
        assert "julian_date" in data
        assert data["julian_date"] == "2000-01-01T12:00:00+00:00"

    def test_missing_julian_day(self, app):
        response = app.test_client().post("/api/julian_date", json={})
        assert response.status_code == 400
        data = json.loads(response.data)
        assert "error" in data

    def test_invalid_julian_day_type(self, app):
        response = app.test_client().post(
            "/api/julian_date", json={"julian_day": "not_a_number"}
        )
        assert response.status_code == 500
        data = json.loads(response.data)
        assert "error" in data


class TestJulianDayAPI:

    def test_valid_julian_day(self, app):
        response = app.test_client().post(
            "/api/julian_day", json={"datetime": "2000-01-01T12:00:00+00:00"}
        )
        assert response.status_code == 200
        data = json.loads(response.data)
        assert "julian_day" in data
        assert data["julian_day"] == 2451545.0

    def test_missing_datetime(self, app):
        response = app.test_client().post("/api/julian_day", json={})
        assert response.status_code == 400
        data = json.loads(response.data)
        assert "error" in data

    def test_invalid_datetime_format(self, app):
        response = app.test_client().post(
            "/api/julian_day", json={"datetime": "invalid_format"}
        )
        assert response.status_code == 500
        data = json.loads(response.data)
        assert "error" in data
