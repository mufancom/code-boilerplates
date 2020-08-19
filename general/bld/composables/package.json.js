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
            'dependencies',
            'bundledDependencies',
            'bundleDependencies',
            'optionalDependencies',
            'peerDependencies',
            'devDependencies',
        ],
    },
};
const DEV_DEPENDENCY_DICT = {
    eslint: '7',
    prettier: '2',
};
const composable = async (options) => {
    let { name, repository, author, license, packages } = library_1.resolveOptions(options);
    let common = {
        repository,
        author,
        license,
    };
    let devDependencies = await utils_1.fetchPackageVersions(DEV_DEPENDENCY_DICT);
    return [
        core_1.json('package.json', {
            name,
            scripts: {
                lint: 'eslint .',
                'lint-prettier': 'prettier --check .',
                test: 'yarn lint-prettier && yarn lint',
            },
            devDependencies,
            ...(packages.length
                ? {
                    private: true,
                    workspaces: packages.map(packageOptions => packageOptions.dir),
                }
                : {
                    version: '0.0.0',
                }),
            ...common,
        }, JSON_OPTIONS),
        ...packages.map(packageOptions => core_1.json(Path.posix.join(packageOptions.dir, 'package.json'), {
            name: packageOptions.name,
            version: '0.0.0',
            ...common,
        }, JSON_OPTIONS)),
    ];
};
exports.default = composable;
