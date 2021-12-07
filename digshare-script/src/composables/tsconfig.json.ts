import {
  ComposableModuleFunction,
  JSONFileOptions,
  json,
} from '@magicspace/core';

import {resolveTypeScriptProjects} from '../../../typescript/bld/library';
const JSON_OPTIONS: JSONFileOptions = {
  sortKeys: [
    'extends',
    {
      key: 'compilerOptions',
      subKeys: {
        top: ['composite', 'module', 'moduleResolution'],
        bottom: ['outDir'],
      },
    },
    'references',
    'files',
    'include',
    'exclude',
  ],
};

const composable: ComposableModuleFunction = options => {
  let {projects} = resolveTypeScriptProjects(options);

  return projects.map(({tsconfigPath}) =>
    json(
      tsconfigPath,
      (data: any) => ({
        ...data,
        compilerOptions: {
          ...data.compilerOptions,
          module: 'ESNext',
          moduleResolution: 'node',
          lib: ['ESNext'],
        },
        'ts-node': {
          compilerOptions: {
            module: 'CommonJS',
          },
        },
      }),
      JSON_OPTIONS,
    ),
  );
};

export default composable;
