import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...compat.extends("eslint:recommended", "next/core-web-vitals"),
  {
    rules: {
      "capitalized-comments": ["error", "always"],
      curly: ["error", "multi-or-nest", "consistent"],
      eqeqeq: ["error", "always"],
      "func-style": ["error", "declaration"],
      "no-duplicate-imports": "error",
      "no-lonely-if": "error",
      "no-nested-ternary": "error",
      "no-plusplus": "error",
      "no-undef": "off",
      "no-undef-init": "error",
      "no-undefined": "error",
      "no-unneeded-ternary": "error",
      "no-self-compare": "error",
      "no-use-before-define": "error",
      "no-useless-concat": "error",
      "no-var": "error",
      "prefer-const": "error",
      "require-await": "error",
      yoda: "error",
    },
  },
];
