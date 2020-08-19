"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@magicspace/core");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const library_1 = require("../library");
const composable = options => {
    let { projects } = library_1.resolveTypeScriptProjects(options);
    let devProjects = projects.filter(project => project.dev);
    return core_1.json('.eslintrc', (data) => {
        var _a, _b;
        return {
            ...data,
            ignorePatterns: lodash_1.default.union(lodash_1.default.castArray((_a = data.ignorePatterns) !== null && _a !== void 0 ? _a : []), [
                'bld',
                '.bld-cache',
            ]),
            overrides: [
                ...((_b = data.overrides) !== null && _b !== void 0 ? _b : []),
                {
                    files: ['**/*.{ts,tsx}'],
                    extends: ['plugin:@mufan/default'],
                    parserOptions: {
                        project: './**/tsconfig.json',
                    },
                },
                ...devProjects.map(project => {
                    return {
                        files: [`${project.srcDir}/**/*.{ts,tsx}`],
                        extends: ['plugin:@mufan/override-dev'],
                    };
                }),
            ],
        };
    });
};
exports.default = composable;
