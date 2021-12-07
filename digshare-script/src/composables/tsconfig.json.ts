import {ComposableModuleFunction, json} from '@magicspace/core';

import {resolveTypeScriptProjects} from '../../../typescript/bld/library';

const composable: ComposableModuleFunction = options => {
  let {projects} = resolveTypeScriptProjects(options);

  return projects.map(({tsconfigPath}) =>
    json(tsconfigPath, (data: any) => ({
      ...data,
      compilerOptions: {
        module: 'ESNext',
        moduleResolution: 'node',
        lib: ['ESNext'],
        ...data.compilerOptions,
      },
      'ts-node': {
        compilerOptions: {
          module: 'CommonJS',
        },
      },
    })),
  );
};

export default composable;
