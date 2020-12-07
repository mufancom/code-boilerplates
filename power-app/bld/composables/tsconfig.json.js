"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@magicspace/core");
const library_1 = require("../../../typescript/bld/library");
const composable = options => {
    let { projects } = library_1.resolveTypeScriptProjects(options);
    return [
        core_1.json('tsconfig.json', {
            references: projects
                .filter(({ srcDir }) => !srcDir.includes('client'))
                .map(project => {
                return { path: project.srcDir };
            }),
            files: [],
        }),
        ...projects.map(project => {
            return core_1.json(project.tsconfigPath, (data) => {
                return {
                    ...data,
                    compilerOptions: {
                        ...data.compilerOptions,
                        experimentalDecorators: true,
                        ...(project.srcDir.includes('client')
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
        }),
    ];
};
exports.default = composable;
