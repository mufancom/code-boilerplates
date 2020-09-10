"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@magicspace/core");
const utils_1 = require("@magicspace/utils");
const DEPENDENCY_DICT = {
    tslib: '2',
};
const DEV_DEPENDENCY_DICT = {
    '@mufan/code': '0.2',
    '@mufan/eslint-plugin': '0.1',
    rimraf: '3',
    typescript: '4',
};
const composable = async () => {
    let [dependencies, devDependencies] = await Promise.all([
        utils_1.fetchPackageVersions(DEPENDENCY_DICT),
        utils_1.fetchPackageVersions(DEV_DEPENDENCY_DICT),
    ]);
    return [
        core_1.json('package.json', (data) => {
            let { scripts = {} } = data;
            scripts = utils_1.extendObjectProperties(scripts, {
                build: utils_1.extendPackageScript(scripts.build, [
                    `rimraf '{,!(node_modules)/**/}{bld,.bld-cache}'`,
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
                dependencies: utils_1.sortObjectKeys({
                    ...data.dependencies,
                    ...dependencies,
                }),
                devDependencies: utils_1.sortObjectKeys({
                    ...data.devDependencies,
                    ...devDependencies,
                }),
            };
        }),
    ];
};
exports.default = composable;
