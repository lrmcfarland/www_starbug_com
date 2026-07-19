# Navigation

This is the starbug celestial navigation API written in python.
It implements Astronomical Algorithms by Jean Meeus among others.

It uses pyproject.toml instead of requirements.txt.

The docker build uses python formatters,
[isort](https://isort.readthedocs.io/en/latest/),
[flake8](https://flake8.pycqa.org/en/latest/), and
[black](https://pypi.org/project/black/).
This runs in docker containers.
Nothing else needs to be installed on your development host,
but I found having [poetry](https://python-poetry.org/)
running locally helpful for
[debugging format fails](#pythonformatting).

- [Navigation](#navigation)
  - [Start](#start)
  - [Stop](#stop)
- [Test](#test)
  - [Python formatting](#python-formatting)
  - [Update libraries](#update-libraries)
    - [Add numpy and scipy to poetry](#add-numpy-and-scipy-to-poetry)
    - [isort](#isort)
    - [flake8](#flake8)
    - [black](#black)
  - [Unit testing](#unit-testing)
    - [poetry](#poetry)
    - [Docker](#docker)
- [Adding numpy scipy](#adding-numpy-scipy)


To run on a development host, clone this repo.
Use docker compose to start the services from the root directory.
This requires [docker](https://www.docker.com/get-started/)
to be installed on your host.

## Start

From the command line

```
docker compose -f 'docker-compose.yml' up -d --build --remove-orphans
```

The web page should now be visible using a browser here


[http://0.0.0.0](http://0.0.0.0)


or

[http://localhost](http://localhost)


## Stop
```
docker compose down
```

# Test

## Python formatting

To run locally, install [poetry](https://python-poetry.org/docs/).
In the `navigator` directory, where `pyproject.toml` is located, run:

```
brew install poetry
```

```
poetry add --group dev isort flake8 black

lrm@lrmz-Mac-mini-2023 navigator % poetry add --group dev isort flake8 black
The following packages are already present in the pyproject.toml and will be skipped:

  - isort
  - flake8
  - black

If you want to update it to the latest compatible version, you can use
`poetry update package`.
If you prefer to upgrade it to the latest available version, you can use
`poetry add package@latest`.

Nothing to add.
```

## Update libraries

```
% poetry run isort .
Command not found: isort
```

This issue happens because Flake8 is listed in your pyproject.toml,
but its files are missing from your local virtual environment.
Run this command to force Poetry to install the missing package

```
poetry install
```

Poetry reads your pyproject.toml file and sees that flake8 is technically
part of the project configuration, which is why poetry add skipped it.
However, the actual virtual environment folder on your Mac mini is out of
sync or was never fully installed. Running poetry install downloads and
symlinks all missing tool

### Add numpy and scipy to poetry

```
rm@lrmz-Mac-mini-2023 navigator % poetry install
Installing dependencies from lock file

Package operations: 2 installs, 0 updates, 0 removals

  - Installing numpy (2.5.1)
  - Installing scipy (1.18.0)

Installing the current project: www (0.1.0)
```

### isort

[isort](https://isort.readthedocs.io/en/latest/):
isort your imports, so you don't have to.

```
poetry run isort .
```

### flake8

[flake8](https://flake8.pycqa.org/en/latest/):
Your Tool For Style Guide Enforcement.

```
poetry run flake8 .
```

### black

[black](https://pypi.org/project/black/):
The uncompromising code formatter.

```
poetry run black .
```

## Unit testing

In the `navigator` directory

### poetry

```
poetry run pytest -s -v
```

### Docker


```
docker build -t www_starbug_com-navigator .
```

# Adding numpy scipy

Update poetry lock for new pyproject.toml file.
