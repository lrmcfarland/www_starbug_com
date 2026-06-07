import pytest

from www_starbug_com import create_app


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
