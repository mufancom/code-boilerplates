import * as Path from 'path';

import {
  ComposableModuleFunction,
  JSONFileOptions,
  json,
} from '@magicspace/core';

import {resolveTypeScriptProjects} from '../library';

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

  return [
    json(
      'tsconfig.json',
      {
        references: projects.map(project => {
          return {path: project.srcDir};
        }),
        files: [],
      },
      JSON_OPTIONS,
    ),
    ...projects.map(
      ({tsconfigPath, srcDir, outDir, esModule, entrances, references}) =>
        json(
          tsconfigPath,
          {
            extends: '@mufan/code/tsconfig.json',
            compilerOptions: {
              composite: true,
              module: esModule ? 'ESNext' : undefined,
              moduleResolution: esModule ? 'Node' : undefined,
              // fallback to undefined if no condition matched.
              experimentalDecorators: entrances.length > 0 || undefined,
              outDir: Path.posix.relative(srcDir, outDir),
            },
            references,
          },
          JSON_OPTIONS,
        ),
    ),
  ];
};

export default composable;
