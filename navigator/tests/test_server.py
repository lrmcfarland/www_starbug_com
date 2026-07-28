import pytest
import json

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
