import type {ComposableModuleFunction} from '@magicspace/core';
import {json} from '@magicspace/core';

import {resolveTypeScriptProjects} from '../../../typescript/bld/library';

const composable: ComposableModuleFunction = options => {
  const {projects} = resolveTypeScriptProjects(options);

  return [
    json('tsconfig.json', {
      references: projects
        .filter(({inDir}) => !inDir.includes('client'))
        .map(project => {
          return {path: project.inDir};
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
            ...(project.inDir.includes('client')
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
