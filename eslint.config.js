import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import importX from 'eslint-plugin-import-x';
import stylistic from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
    globalIgnores(['dist']),
    {
        files: ['**/*.{js,ts,tsx}'],
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended,
            reactHooks.configs.flat.recommended,
            reactRefresh.configs.vite,
            importX.flatConfigs.recommended,
            importX.flatConfigs.typescript,
        ],
        plugins: {
            '@stylistic': stylistic,
        },
        languageOptions: {
            globals: globals.browser,
        },
        rules: {
            semi: 'off',
            '@stylistic/semi': ['error', 'always'],
            indent: ['error', 4],
            curly: ['error', 'all'],
            'brace-style': ['error', '1tbs', {
                allowSingleLine: false,
            }],
            'object-curly-newline': [
                'error',
                {
                    ObjectExpression: {
                        minProperties: 1,
                        consistent: true,
                    },
                    ObjectPattern: 'never',
                    ImportDeclaration: {
                        multiline: true,
                        consistent: true,
                    },
                    ExportDeclaration: {
                        multiline: true,
                        consistent: true,
                    },
                },
            ],
            'object-property-newline': ['error', {
                allowAllPropertiesOnSameLine: false,
            }],
            'comma-dangle': ['error', 'always-multiline'],
            'no-trailing-spaces': 'error',
            '@stylistic/member-delimiter-style': [
                'error',
                {
                    multiline: {
                        delimiter: 'semi',
                        requireLast: true,
                    },
                    singleline: {
                        delimiter: 'semi',
                        requireLast: false,
                    },
                },
            ],
            'import-x/order': [
                'error',
                {
                    groups: [
                        ['builtin', 'external'],
                        ['internal', 'parent', 'sibling', 'index'],
                    ],
                    'newlines-between': 'always',
                },
            ],
        },
    },
]);
