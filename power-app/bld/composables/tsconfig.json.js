"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@magicspace/core");
const library_1 = require("../../../typescript/bld/library");
const composable = options => {
    let { projects } = library_1.resolveTypeScriptProjects(options);
    return projects.map(project => {
        return core_1.json(project.tsconfigPath, (data) => {
            var _a;
            let name = (_a = project.package.tsProjects) === null || _a === void 0 ? void 0 : _a[0].name;
            return {
                ...data,
                compilerOptions: {
                    ...data.compilerOptions,
                    experimentalDecorators: true,
                    ...(name === 'client'
                        ? {
                            jsx: 'react',
                            types: ['@types/node'],
                            lib: ['esNext', 'DOM'],
                            sourceMap: true,
                            module: 'esnext',
                            moduleResolution: 'Node',
                        }
                        : {}),
                },
            };
        });
    });
};
exports.default = composable;
