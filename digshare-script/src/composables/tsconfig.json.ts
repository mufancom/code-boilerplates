import {ComposableModuleFunction, json} from '@magicspace/core';

import {resolveTypeScriptProjects} from '../../../typescript/bld/library';

const composable: ComposableModuleFunction = options => {
  let {projects} = resolveTypeScriptProjects(options);

  return projects.map(({tsconfigPath}) =>
    json(tsconfigPath, (data: any) => ({
      ...data,
      compilerOptions: {
        lib: ['DOM', 'ESNext'],
        ...data.compilerOptions,
      },
    })),
  );
};

export default composable;
