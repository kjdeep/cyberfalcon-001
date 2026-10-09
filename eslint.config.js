import globals from "globals";
import js from "@eslint/js";
import { globalIgnores } from "eslint/config";

export default [
  globalIgnores(["**/*.ts", "**/*.tsx", "dist/**", "node_modules/**", "public/**"]),
  js.configs.recommended,
  {
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: { ecmaVersion: "latest", sourceType: "module", globals: globals.node },
    rules: { "no-unused-vars": ["error", { argsIgnorePattern: "^_" }] },
  },
];
