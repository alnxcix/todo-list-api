import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintPluginTS from "@typescript-eslint/eslint-plugin";
import eslintParserTS from "@typescript-eslint/parser";

export default [
  {
    ignores: ["dist", "node_modules"],
  },
  {
    languageOptions: {
      parser: eslintParserTS,
    },
    plugins: {
      "@typescript-eslint": eslintPluginTS,
      prettier: eslintPluginPrettier,
    },
    rules: {
      "prettier/prettier": "error",
      "no-console": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
    },
  },
];
