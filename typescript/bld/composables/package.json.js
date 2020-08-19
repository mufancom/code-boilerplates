"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@magicspace/core");
const utils_1 = require("@magicspace/utils");
const library_1 = require("../library");
const DEV_DEPENDENCY_DICT = {
    '@mufan/code': '0.2',
    '@mufan/eslint-plugin': '0.1',
    rimraf: '3',
    typescript: '3',
};
const composable = async (options) => {
    let { projects, package: { packagesDir }, } = library_1.resolveTypeScriptProjects(options);
    let anyProjectsInRoot = projects.some(project => !project.package);
    let anyProjectsInPackage = projects.some(project => !!project.package);
    let rimrafArgs = [
        ...(anyProjectsInRoot ? ['bld', '.bld-cache'] : []),
        ...(anyProjectsInPackage ? [`'${packagesDir}/*/{bld,.bld-cache}'`] : []),
    ];
    let devDependencies = await utils_1.fetchPackageVersions(DEV_DEPENDENCY_DICT);
    return [
        core_1.json('package.json', (data) => {
            let { scripts = {} } = data;
            scripts = utils_1.extendObjectProperties(scripts, {
                build: utils_1.extendPackageScript(scripts.build, [
                    `rimraf ${rimrafArgs.join(' ')}`,
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
                devDependencies: utils_1.sortObjectKeys({
                    ...data.devDependencies,
                    ...devDependencies,
                }),
            };
        }),
    ];
};
exports.default = composable;
