"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@magicspace/core");
const DEFAULT_PRETTIER_OPTIONS = {
    printWidth: 80,
    tabWidth: 2,
    useTabs: false,
    semi: true,
    singleQuote: true,
    quoteProps: 'as-needed',
    jsxSingleQuote: false,
    trailingComma: 'all',
    bracketSpacing: false,
    jsxBracketSameLine: false,
    arrowParens: 'avoid',
};
const composable = options => { var _a; return core_1.json('.prettierrc', (_a = options.prettier) !== null && _a !== void 0 ? _a : DEFAULT_PRETTIER_OPTIONS); };
exports.default = composable;
