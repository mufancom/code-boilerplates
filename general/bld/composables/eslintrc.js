"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@magicspace/core");
const JSON_OPTIONS = {
    /** @link https://eslint.org/docs/user-guide/configuring */
    sortKeys: [
        'root',
        'noInlineConfig',
        'reportUnusedDisableDirectives',
        'ignorePatterns',
        'plugins',
        'extends',
        'processor',
        'env',
        'parser',
        'parserOptions',
        'globals',
        'rules',
        'settings',
        'overrides',
    ],
};
exports.default = core_1.json('.eslintrc', {
    root: true,
    extends: ['eslint:recommended'],
    env: {
        node: true,
        es2020: true,
    },
}, JSON_OPTIONS);
