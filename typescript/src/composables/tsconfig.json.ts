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
        references: projects.flatMap(({inDir, builds}) =>
          builds.map(({module}) => ({
            path:
              builds.length === 1 || module === 'cjs'
                ? inDir
                : Path.posix.join(inDir, `tsconfig.${module}.json`),
          })),
        ),
        files: [],
      },
      JSON_OPTIONS,
    ),
    ...projects.flatMap(({inDir, entrances, noEmit, references, builds}) =>
      _.sortBy(builds, build => ['cjs', 'esm'].indexOf(build.module)).map(
        ({module, outDir}) => {
          const primary = builds.length === 1 || module === 'cjs';

          return json(
            Path.posix.join(
              inDir,
              primary ? 'tsconfig.json' : `tsconfig.${module}.json`,
            ),
            primary
              ? {
                  extends: '@mufan/code/tsconfig.json',
                  compilerOptions: {
                    composite: true,
                    module: module === 'esm' ? 'esnext' : undefined,
                    moduleResolution: module === 'esm' ? 'nodenext' : undefined,
                    // fallback to undefined if no condition matched.
                    experimentalDecorators: entrances.length > 0 || undefined,
                    outDir: Path.posix.relative(inDir, outDir),
                    noEmit: noEmit ? true : undefined,
                  },
                  references,
                }
              : {
                  extends: './tsconfig.json',
                  compilerOptions: {
                    module: module === 'esm' ? 'esnext' : undefined,
                    moduleResolution: module === 'esm' ? 'nodenext' : undefined,
                    outDir: Path.posix.relative(inDir, outDir),
                  },
                },
            JSON_OPTIONS,
          );
        },
      ),
    ),
  ];
});
