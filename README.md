# React + TypeScript + Vite + Tailwind

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


## Tailwind CSS Setup

### Install Tailwind CSS

```sh
yarn add -D tailwindcss @tailwindcss/vite
```

### Configure Tailwind CSS

Modify `vite.config.js`:

```js
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
});
```

### Import Tailwind CSS

Add the following to `src/index.css`:

```css
@import 'tailwindcss';
```

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```

## ESLint and Prettier Setup

### Install ESLint, Prettier, and Vite Plugin

```sh
yarn add -D eslint prettier vite-plugin-eslint //other needed all deps
```

### Configure Vite to Use `vite-plugin-eslint` (optional)

Modify `vite.config.ts` to include the plugin:

```ts
import eslint from 'vite-plugin-eslint';

export default defineConfig({
  plugins: [eslint()],
});
```

### Add Scripts for Linting and Formatting

Modify `package.json`:

```json
"scripts": {
  "lint": "eslint . --ext .ts,.tsx --fix",
  "format": "prettier --write .",
}
```

## Running the Project

Start the development server:

```sh
yarn dev
```

Run the build process:

```sh
yarn build
yarn preview
```

Lint and format the code:

```sh
yarn lint
yarn format
```
