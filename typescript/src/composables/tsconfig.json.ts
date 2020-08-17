import * as Path from 'path';

import {ComposableModuleFunction, json} from '@magicspace/core';

import {resolveTypeScriptProjects} from '../library';

const JSON_OPTIONS = {
  sortKeys: [
    'extends',
    'compilerOptions',
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
    ...projects.map(({tsconfigPath, srcDir, outDir}) =>
      json(
        tsconfigPath,
        {
          extends: '@mufan/code/tsconfig.json',
          compilerOptions: {
            composite: true,
            outDir: Path.posix.relative(srcDir, outDir),
          },
        },
        JSON_OPTIONS,
      ),
    ),
  ];
};

export default composable;
