# Holly

This is the starbug.com home page.
It is built with React and Vite, running in a Docker container.

- [Holly](#holly)
- [Setup on OSX](#setup-on-osx)
  - [Brew install nvm](#brew-install-nvm)
  - [Install latest stable](#install-latest-stable)
- [Create a React App](#create-a-react-app)
  - [To run](#to-run)
- [Dockerize the React App](#dockerize-the-react-app)
  - [Add](#add)
  - [Production](#production)
    - [Build](#build)
    - [Run](#run)
  - [Development](#development)
    - [Build](#build-1)
    - [Run](#run-1)
- [React + TypeScript + Vite](#react--typescript--vite)
  - [React Compiler](#react-compiler)
  - [Expanding the ESLint configuration](#expanding-the-eslint-configuration)


# Setup on OSX

## Brew install nvm

```
brew install nvm
```

## Install latest stable

```
nvm install --lts
```

# Create a React App

Initial typescript react in a new repo

```
npm create vite@latest home -- --template react-ts
```

## To run

Stand alone from the command line

```
npm run dev
```

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
lrm@lrmz-Mac-mini-2023 holly % 
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


# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
