import * as Path from 'path';

import {composable, json} from '@magicspace/core';
import _ from 'lodash';

import type {ResolvedOptions} from '../library';

export default composable<ResolvedOptions>(({resolvedProjects: projects}) => {
  return [
    json('.eslintrc', (data: any) => {
      return {
        ...data,
        ignorePatterns: [
          ...new Set([
            ...(data.ignorePatterns ?? []),
            ...projects.flatMap(project => [
              `/${project.srcDir}/`,
              `/${project.bldDir}/`,
            ]),
          ]),
        ],
      };
    }),
    ...projects.map(project =>
      json(Path.join(project.inDir, '.eslintrc'), (data: any) => {
        return {
          ...data,
          root: true,
          overrides: [
            ...(data?.overrides ?? []),
            {
              files: ['**/*.{ts,tsx}'],
              extends: [
                'plugin:@mufan/default',
                ...(project.dev ? ['plugin:@mufan/override-dev'] : []),
              ],
              parserOptions: {
                project: 'tsconfig.json',
              },
            },
          ],
        };
      }),
    ),
  ];
});
