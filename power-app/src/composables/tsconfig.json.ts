import {ComposableModuleFunction, json} from '@magicspace/core';

import {resolveTypeScriptProjects} from '../../../typescript/bld/library';

const composable: ComposableModuleFunction = options => {
  let {projects} = resolveTypeScriptProjects(options);

  return [
    json('tsconfig.json', {
      references: projects
        .filter(({srcDir}) => !srcDir.includes('client'))
        .map(project => {
          return {path: project.srcDir};
        }),
      files: [],
    }),
    ...projects.map(project => {
      return json(project.tsconfigPath, (data: any) => {
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

export default composable;
