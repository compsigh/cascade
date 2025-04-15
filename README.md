# cascade ![Static Badge](https://img.shields.io/badge/compsigh-black?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB3aWR0aD0iMTAyNCIgaGVpZ2h0PSIxMDI0IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8Y2lyY2xlIGN4PSI1MTIiIGN5PSI1MTIiIHI9IjM3NSIgc3Ryb2tlPSIjRkRCQjMwIiBzdHJva2Utd2lkdGg9IjUwIi8%2BCjxyZWN0IHg9IjI5NCIgeT0iNjk0LjIxOCIgd2lkdGg9IjQ1MCIgaGVpZ2h0PSI1MCIgcng9IjI1IiB0cmFuc2Zvcm09InJvdGF0ZSgtNjAgMjk0IDY5NC4yMTgpIiBmaWxsPSIjRkRCQjMwIi8%2BCjxyZWN0IHg9IjQ2MS4zMDEiIHk9IjY5My43MTEiIHdpZHRoPSI0NTAiIGhlaWdodD0iNTAiIHJ4PSIyNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTYwIDQ2MS4zMDEgNjkzLjcxMSkiIGZpbGw9IiNGREJCMzAiLz4KPC9zdmc%2BCg%3D%3D&link=https%3A%2F%2Fcompsigh.club%2F)

> The web platform for [cascade](https://cascade.compsigh.club/)

## Goals

General goal is to stabalize and fix bugs in the old cascade platform.

Check out current goals in [issues](https://github.com/compsigh/cascade/issues)

## Development

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

### Linting & Formatting

> [!IMPORTANT]
> Run a [format](https://prettier.io/docs/why-prettier) and [lint](https://eslint.org/docs/latest/about/) before pushing.

- **Check linting** (ESLint 8 with `eslint:recommended`, [`next`, `next/core-web-vitals`, `next/typescript`](https://nextjs.org/docs/app/api-reference/config/eslint), and [`prettier`](https://github.com/prettier/eslint-config-prettier) configurations):

  ```bash
  npm run lint
  ```

- **Automatically fix linting issues**:

  ```bash
  npm run lint:fix
  ```

- **Check formatting** (Prettier):

  ```bash
  npm run format
  ```

- **Automatically fix formatting issues**:

  ```bash
  npm run format:fix
  ```
