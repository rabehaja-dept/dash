/**
 * @type {import('@types/eslint').Linter.BaseConfig}
 */
module.exports = {
  extends: [
    "@remix-run/eslint-config",
    "@remix-run/eslint-config/node",
    "@remix-run/eslint-config/jest-testing-library",
    "prettier",
    "plugin:storybook/recommended",
  ],
  // We're using vitest which has a very similar API to jest
  // (so the linting plugins work nicely), but we have to
  // set the jest version explicitly.
  settings: {
    jest: {
      version: 27,
    },
  },
  rules: {
    "@typescript-eslint/consistent-type-imports": 0,
    "react-hooks/rules-of-hooks": 0,
  },
  ignorePatterns: ["**/strapi/**", "**/storybook-static/**"],
};
