import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import eslintJs from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";
import importPlugin from "eslint-plugin-import";
import a11yPlugin from "eslint-plugin-jsx-a11y";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  eslintJs.configs.recommended,
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      react: reactPlugin,
      "react-hooks": hooksPlugin,
      import: importPlugin,
      "jsx-a11y": a11yPlugin,
      "@typescript-eslint": typescriptEslint,
      prettier: prettierPlugin,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        typescript: {},
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
    rules: {
      // Prettier
      "prettier/prettier": "warn",

      // TypeScript
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",

      // React
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "react/display-name": "off",
      "react/jsx-curly-brace-presence": [
        "warn",
        { props: "never", children: "never" },
      ],

      // React Hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Imports
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],

      // General
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-unused-vars": "off", // Use TypeScript version instead

      // JSX Accessibility
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/aria-props": "warn",
      "jsx-a11y/aria-proptypes": "warn",
      "jsx-a11y/aria-role": "warn",
      "jsx-a11y/aria-unsupported-elements": "warn",
      "jsx-a11y/role-has-required-aria-props": "warn",
    },
  },
  {
    // Next.js entry points - less restrictive rules
    files: ["src/app/**/*.{ts,tsx}", "src/pages/**/*.{ts,tsx}"],
    rules: {
      "import/no-default-export": "off",
    },
  },
  prettierConfig,
];

export default eslintConfig;
