"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Path = tslib_1.__importStar(require("path"));
const core_1 = require("@magicspace/core");
const utils_1 = require("@magicspace/utils");
const library_1 = require("../library");
const JSON_OPTIONS = {
    /** @link https://docs.npmjs.com/files/package.json */
    sortKeys: {
        top: [
            'name',
            'version',
            'private',
            'publishConfig',
            'description',
            'keywords',
            'homepage',
            'man',
            'bugs',
            'repository',
            'license',
            'author',
            'contributors',
            'type',
            'main',
            'browser',
            'types',
            'bin',
            'files',
            'directories',
            'engines',
            'engineStrict',
            'os',
            'cpu',
        ],
        bottom: [
            'config',
            'scripts',
            'workspaces',
            {
                key: 'dependencies',
                subKeys: 'asc',
            },
            {
                key: 'bundledDependencies',
                subKeys: 'asc',
            },
            {
                key: 'bundleDependencies',
                subKeys: 'asc',
            },
            {
                key: 'optionalDependencies',
                subKeys: 'asc',
            },
            {
                key: 'peerDependencies',
                subKeys: 'asc',
            },
            {
                key: 'devDependencies',
                subKeys: 'asc',
            },
        ],
    },
};
const DEV_DEPENDENCY_DICT = {
    eslint: '7',
    prettier: '2',
};
const composable = async (options) => {
    let { name, description, repository, author, license, packagesDir, packages, } = library_1.resolveOptions(options);
    let common = {
        repository,
        author,
        license,
    };
    let devDependencies = await utils_1.fetchPackageVersions(DEV_DEPENDENCY_DICT);
    return [
        core_1.json('package.json', {
            name,
            description,
            scripts: {
                lint: 'eslint .',
                'lint-prettier': 'prettier --check .',
                test: 'yarn lint-prettier && yarn lint',
            },
            devDependencies,
            ...(packagesDir !== undefined
                ? {
                    private: true,
                    workspaces: packages.map(packageOptions => packageOptions.dir),
                }
                : {}),
        }, JSON_OPTIONS),
        ...packages.map(packageOptions => core_1.json(Path.posix.join(packageOptions.dir, 'package.json'), (data) => {
            return {
                ...data,
                ...common,
                name: packageOptions.name,
                version: '0.0.0',
            };
        }, JSON_OPTIONS)),
    ];
};
exports.default = composable;
