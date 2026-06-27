import js from '@eslint/js';
import tseslint from 'typescript-eslint';

import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import sonarjs from 'eslint-plugin-sonarjs';
import importPlugin from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

import globals from 'globals';

export default tseslint.config(
  {
    ignores: ['dist', 'build', 'coverage', 'node_modules', '*.config.js', '*.config.ts'],
  },

  js.configs.recommended,

  ...tseslint.configs.recommended,

  {
    files: ['**/*.{ts,tsx}'],

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },

    plugins: {
      react,
      'react-hooks': reactHooks,
      sonarjs,
      import: importPlugin,
      prettier,
      'unused-imports': unusedImports,
      'simple-import-sort': simpleImportSort,
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    rules: {
      /*
       * Sonarqube
       */

      ...sonarjs.configs.recommended.rules,

      /*
       * React
       */

      ...reactHooks.configs.recommended.rules,

      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',

      /*
       * Typescript
       */

      '@typescript-eslint/no-explicit-any': 'warn',

      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
        },
      ],

      '@typescript-eslint/no-unnecessary-condition': 'error',

      '@typescript-eslint/strict-boolean-expressions': [
        'warn',
        {
          allowNullableBoolean: true,
        },
      ],

      '@typescript-eslint/no-unused-vars': 'off',

      /*
       * Imports
       */

      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      'import/no-duplicates': 'error',

      'import/first': 'error',

      'import/newline-after-import': [
        'error',
        {
          count: 1,
        },
      ],

      /*
       * Unused imports
       */

      'unused-imports/no-unused-imports': 'error',

      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',

          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      /*
       * Sonar-like code quality
       */

      eqeqeq: ['error', 'always'],

      curly: 'error',

      'no-console': [
        'warn',
        {
          allow: ['warn', 'error'],
        },
      ],

      'prefer-const': 'error',

      'no-var': 'error',

      'object-shorthand': 'error',

      'no-duplicate-imports': 'error',

      'no-nested-ternary': 'warn',

      'max-depth': ['warn', 4],

      'max-lines-per-function': [
        'warn',
        {
          max: 80,
          skipBlankLines: true,
          skipComments: true,
        },
      ],

      /*
       * Prettier
       */

      'prettier/prettier': 'error',
    },
  },

  prettierConfig
);
