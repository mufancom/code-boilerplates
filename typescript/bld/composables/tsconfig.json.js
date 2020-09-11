"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Path = tslib_1.__importStar(require("path"));
const core_1 = require("@magicspace/core");
const library_1 = require("../library");
const JSON_OPTIONS = {
    sortKeys: [
        'extends',
        {
            key: 'compilerOptions',
            subKeys: {
                top: ['composite'],
                bottom: ['outDir'],
            },
        },
        'references',
        'files',
        'include',
        'exclude',
    ],
};
const composable = options => {
    let { projects } = library_1.resolveTypeScriptProjects(options);
    return [
        core_1.json('tsconfig.json', {
            references: projects.map(project => {
                return { path: project.srcDir };
            }),
            files: [],
        }, JSON_OPTIONS),
        ...projects.map(({ tsconfigPath, srcDir, outDir }) => core_1.json(tsconfigPath, {
            extends: '@mufan/code/tsconfig.json',
            compilerOptions: {
                composite: true,
                outDir: Path.posix.relative(srcDir, outDir),
            },
        }, JSON_OPTIONS)),
    ];
};
exports.default = composable;
