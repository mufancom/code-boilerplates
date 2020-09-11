"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@magicspace/core");
const utils_1 = require("@magicspace/utils");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const library_1 = require("../../../typescript/bld/library");
const DEPENDENCY_DICT = {
    'entrance-decorator': '0.1',
};
const composable = async (options) => {
    let { projects } = library_1.resolveTypeScriptProjects(options);
    let packagesWithTypeScriptProject = lodash_1.default.uniqBy(projects.map(project => project.package), packageOptions => packageOptions.packageJSONPath);
    let dependencies = await utils_1.fetchPackageVersions(DEPENDENCY_DICT);
    return packagesWithTypeScriptProject.map(packageOptions => core_1.json(packageOptions.packageJSONPath, (data) => {
        return {
            ...data,
            dependencies: {
                ...data.dependencies,
                ...dependencies,
            },
        };
    }));
};
exports.default = composable;
