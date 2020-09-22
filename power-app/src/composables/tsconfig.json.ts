import {ComposableModuleFunction, json} from '@magicspace/core';

import {resolveTypeScriptProjects} from '../../../typescript/bld/library';

const composable: ComposableModuleFunction = options => {
  let {projects} = resolveTypeScriptProjects(options);

  return projects.map(project => {
    return json(project.tsconfigPath, (data: any) => {
      let name = project.package.tsProjects?.[0].name;

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

export default composable;
