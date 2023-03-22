// SPDX-FileCopyrightText: 2022 Johannes Loher
//
// SPDX-License-Identifier: MIT

module.exports = {
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },

  env: {
    browser: true,
    es2021: true,
    jquery: true,
  },

  extends: ['eslint:recommended', '@typhonjs-fvtt/eslint-config-foundry.js/0.8.0', 'plugin:prettier/recommended'],

  plugins: [],

  globals: {
    libWrapper: 'readonly',
    ClientKeybindings: 'readonly',
    KeybindingsConfig: 'readonly',
    DocumentSheetConfig: 'readonly',
  },

  rules: {
    // Specify any specific ESLint rules.
  },

  overrides: [
    {
      files: ['./*.js', './*.mjs', './tools/**/*'],
      env: {
        node: true,
        browser: false,
      },
    },
  ],
};
