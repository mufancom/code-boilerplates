"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Path = tslib_1.__importStar(require("path"));
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
    let { projects } = library_1.resolveTypeScriptProjects(options);
    let packagesWithTypeScriptProject = lodash_1.default.uniqBy(projects.map(project => project.package), packageOptions => packageOptions.packageJSONPath);
    let [dependencies, devDependencies] = await Promise.all([
        utils_1.fetchPackageVersions(DEPENDENCY_DICT),
        utils_1.fetchPackageVersions(DEV_DEPENDENCY_DICT),
    ]);
    return [
        core_1.json('package.json', (data) => {
            let { scripts = {} } = data;
            let rimrafScript;
            {
                let rimrafPattern = guessReadableGlobPattern(projects.map(project => project.bldDir));
                if (rimrafPattern) {
                    rimrafScript = `rimraf ${/\s/.test(rimrafPattern) ? `'${rimrafPattern}'` : rimrafPattern}`;
                }
            }
            scripts = utils_1.extendObjectProperties(scripts, {
                build: utils_1.extendPackageScript(scripts.build, lodash_1.default.compact([rimrafScript, 'tsc --build'])),
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
function guessReadableGlobPattern(paths) {
    if (paths.length === 0) {
        return undefined;
    }
    let parentDirAndBaseNameArray = paths.map(path => {
        return { parentDir: Path.dirname(path), baseName: Path.basename(path) };
    });
    let parentDirs = lodash_1.default.uniq(parentDirAndBaseNameArray.map(info => info.parentDir));
    let upperParentDirs = lodash_1.default.uniq(parentDirs.map(parentDir => Path.dirname(parentDir)));
    if (upperParentDirs.length > 1) {
        // Guess only patterns with at most single '*' at the end.
        return undefined;
    }
    let parentPattern = parentDirs.length > 1 ? `${upperParentDirs[0]}/*` : parentDirs[0];
    let baseNames = lodash_1.default.uniq(parentDirAndBaseNameArray.map(info => info.baseName));
    let baseNamePattern = baseNames.length > 1 ? `{${baseNames.sort().join(',')}}` : baseNames[0];
    return `${parentPattern.replace(/^\.\//, '')}/${baseNamePattern}`;
}
