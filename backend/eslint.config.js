import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,

  {
    languageOptions: {
      globals: globals.node,
      ecmaVersion: "latest",
      sourceType: "module"
    },

    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error"
    }
  }
];