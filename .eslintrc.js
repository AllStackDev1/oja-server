module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint/eslint-plugin"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "prettier",
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [".eslintrc.js"],
  rules: {
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "no-var": "error",
    "spaced-comment": [
      "error",
      "always",
      {
        exceptions: ["-", "+"],
      },
    ],
    "prettier/prettier": [
      "error",
      {
        trailingComma: "none",
        singleQuote: true,
        tabWidth: 2,
        printWidth: 80,
        semi: false,
        arrowParens: "avoid",
        spacedComment: false,
        endOfLine: "auto",
      },
    ],
  },
};
