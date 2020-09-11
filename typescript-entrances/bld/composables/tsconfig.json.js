"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@magicspace/core");
const _utils_1 = require("./@utils");
const composable = options => {
    let projects = _utils_1.resolveTypeScriptProjectsWithEntrances(options);
    return projects.map(project => {
        return core_1.json(project.tsconfigPath, (data) => {
            return {
                ...data,
                compilerOptions: {
                    ...data.compilerOptions,
                    experimentalDecorators: true,
                },
            };
        });
    });
};
exports.default = composable;
