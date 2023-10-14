import * as Path from 'path';

import type {JSONFileOptions} from '@magicspace/core';
import {composable, json} from '@magicspace/core';
import _ from 'lodash';

import type {ResolvedOptions} from '../library';

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

export default composable<ResolvedOptions>(({resolvedProjects: projects}) => {
  return [
    json(
      'tsconfig.json',
      {
        references: projects.map(({inDir}) => {
          return {
            path: inDir,
          };
        }),
        files: [],
      },
      JSON_OPTIONS,
    ),
    ...projects.map(({inDir, entrances, outDir, references}) =>
      json(
        Path.posix.join(inDir, 'tsconfig.json'),
        {
          extends: Path.posix.relative(inDir, 'tsconfig.base.json'),
          compilerOptions: {
            composite: true,
            // fallback to undefined if no condition matched.
            experimentalDecorators: entrances.length > 0 || undefined,
            rootDir: '.',
            outDir: Path.posix.relative(inDir, outDir),
            // noEmit is not supported in composite mode, outDir would
            // differ though.
          },
          references,
        },
        JSON_OPTIONS,
      ),
    ),
  ];
});
