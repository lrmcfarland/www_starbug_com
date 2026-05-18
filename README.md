# www.starbug.com

This is the source repo for the www.starbug.com website.

This implementation runs as two microservices
in [docker](https://www.docker.com/) containers.
It is based on [nginx ](https://nginx.org/) running as a reverse proxy
in one container.
It routes traffic to `home`, a [flask](https://flask.palletsprojects.com/en/stable/)
server running in an adjacent container.
These are managed by [docker compose](https://docs.docker.com/compose/) 

# docker compose

Use docker compose to start the services from the root directory of the clone of this repo.
This requires [docker](https://www.docker.com/get-started/) to be installed on your host.

```
docker compose up -d --remove-orphans
```

```
docker compose down
```

# Python formatting

To run locally, install [poetry](https://python-poetry.org/docs/).
In the `home` directory, where `pyproject.toml` is located, run:

## isort

```
poetry run isort .
```

## lint
```
poetry run flake8 .
```

## Format
```
poetry run black .
```

# Flask unit testing

In the `home` directory

## Test the build the image

```
docker build -t www_starbug_com-home .
```

This is an example with a mismatch in the hello world text.

```
0.810 ============================= test session starts ==============================                             
0.810 platform linux -- Python 3.11.15, pytest-8.4.2, pluggy-1.6.0                                                 
0.810 rootdir: /www_starbug_com                                                                                    
0.810 configfile: pyproject.toml
0.810 testpaths: tests
0.810 plugins: flask-1.3.0, anyio-4.13.0
0.810 collected 1 item
0.810 
0.810 tests/test_home.py F                                                     [100%]
0.846 
0.846 =================================== FAILURES ===================================
0.846 __________________________________ test_hello __________________________________
0.846 
0.846 app = <Flask 'www_starbug_com'>
0.846 
0.846     def test_hello(app):
0.846         response = app.test_client().get('/')
0.846         assert response.status_code == 200
0.846 >       assert response.data == b"Hello, World with some tests!"
0.846 E       AssertionError: assert b'Hello, Worl...h main tests!' == b'Hello, Worl...h some tests!'
0.846 E         
0.846 E         At index 18 diff: b'm' != b's'
0.846 E         Use -v to get more diff
0.846 
0.846 tests/test_home.py:13: AssertionError
0.846 =========================== short test summary info ============================
0.846 FAILED tests/test_home.py::test_hello - AssertionError: assert b'Hello, Worl....
0.846 ============================== 1 failed in 0.17s ===============================
```
