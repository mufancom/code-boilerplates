"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@magicspace/core");
const utils_1 = require("@magicspace/utils");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const library_1 = require("../library");
const DEPENDENCY_DICT = {
    tslib: '2',
};
const DEV_DEPENDENCY_DICT = {
    '@mufan/code': '0.2',
    '@mufan/eslint-plugin': '0.1',
    rimraf: '3',
    typescript: '4',
};
const composable = async (options) => {
    let { package: { packagesDir }, projects, } = library_1.resolveTypeScriptProjects(options);
    let packagesWithTypeScriptProject = lodash_1.default.uniqBy(projects.map(project => project.package), packageOptions => packageOptions.packageJSONPath);
    let [dependencies, devDependencies] = await Promise.all([
        utils_1.fetchPackageVersions(DEPENDENCY_DICT),
        utils_1.fetchPackageVersions(DEV_DEPENDENCY_DICT),
    ]);
    return [
        core_1.json('package.json', (data) => {
            let { scripts = {} } = data;
            scripts = utils_1.extendObjectProperties(scripts, {
                build: utils_1.extendPackageScript(scripts.build, [
                    `rimraf '${packagesDir === undefined ? '' : `${packagesDir}/*/`}{bld,.bld-cache}'`,
                    'tsc --build',
                ]),
            }, {
                before: '*lint*',
            });
            scripts = utils_1.extendObjectProperties(scripts, {
                test: utils_1.extendPackageScript(scripts.test, 'yarn build', {
                    after: '*lint-prettier*',
                }),
            }, {
                after: '*lint*',
            });
            return {
                ...data,
                scripts,
                devDependencies: {
                    ...data.devDependencies,
                    ...devDependencies,
                },
            };
        }),
        ...packagesWithTypeScriptProject.map(packageOptions => core_1.json(packageOptions.packageJSONPath, (data) => {
            return {
                ...data,
                dependencies: {
                    ...data.dependencies,
                    ...dependencies,
                },
            };
        })),
    ];
};
exports.default = composable;
