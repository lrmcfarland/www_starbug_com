# Holly

This is the starbug.com home page.
It is built with React and Vite, running in a Docker container.

- [Holly](#holly)
- [Setup React](#setup-react)
  - [On OSX](#on-osx)
  - [Install latest stable](#install-latest-stable)
  - [Install Vitest and jest](#install-vitest-and-jest)
- [React](#react)
  - [Create](#create)
  - [Run](#run)
- [Dockerize the React App](#dockerize-the-react-app)
  - [Add](#add)
  - [Production](#production)
    - [Build](#build)
    - [Run](#run-1)
  - [Development](#development)
    - [Build](#build-1)
    - [Run](#run-2)
- [Test](#test)
  - [Build the test image](#build-the-test-image)
  - [Run the unit tests](#run-the-unit-tests)
- [Deploy](#deploy)


# Setup React

## On OSX

Use [brew](https://brew.sh/)

```
brew install nvm
```

## Install latest stable

```
nvm install --lts
```

## Install Vitest and jest

```
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom
```
# React

Create a react app to manage the holly page inside a docker container.

## Create

Use [vite](https://vite.dev/) to create a TypeScript scaffold in a new `holly` directory
in the `www_starbug_com` development repo.

```
npm create vite@latest holly -- --template react-ts
```

## Run

In the `holly` directory

```
npm run dev
```

The app will be available on http://localhost:5173/


```
VITE v8.0.16  ready in 537 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
h

  Shortcuts
  press r + enter to restart the server
  press u + enter to show server url
  press o + enter to open in browser
  press c + enter to clear console
  press q + enter to quit
q
```

# Dockerize the React App

[Containerize a React.js Application](https://docs.docker.com/guides/reactjs/containerize/)

[How to Dockerize a React App](https://www.docker.com/blog/how-to-dockerize-react-app/)

Warning: The production Dockerfile of this example at this time (2026-06-14) has "two entirely separate, competing Docker setups pasted back-to-back.

## Add

- Dockerfile
- Dockerfile.dev
- .dockerignore


## Production

### Build

```
docker build -t holly -f Dockerfile .
```

### Run

```
docker run -p 3000:3000 holly
```


## Development

### Build

```
docker build -t holly-dev -f Dockerfile.dev .
```

### Run

```
docker run -p 5173:5173 holly-dev
```

# Test

[Run React.js tests in a container](https://docs.docker.com/guides/reactjs/run-tests/#run-tests-during-development)

## Build the test image

```
docker compose build holly-test
```

## Run the unit tests

```
docker compose run --rm holly-test
```

# Deploy

Set the VITE_ALLOWED_HOSTS in GitHub secrets to the AWS EC2 instance created to host this.
