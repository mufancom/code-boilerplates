import * as Path from 'path';

import {composable, json} from '@magicspace/core';

import type {ResolvedOptions} from '../library/index.js';

export default composable<ResolvedOptions>(({resolvedProjects: projects}) => {
  return [
    json('.eslintrc.json', (data: any) => {
      return {
        ...data,
        ignorePatterns: [
          ...new Set([
            ...(data.ignorePatterns ?? []),
            ...projects.flatMap(project => [
              `/${project.srcDir === '.' ? project.inDir : project.srcDir}/`,
              ...(project.noEmit ? [] : [`/${project.bldDir}/`]),
            ]),
          ]),
        ],
      };
    }),
    ...projects.map(project =>
      json(Path.join(project.inDir, '.eslintrc.json'), (data: any) => {
        return {
          ...data,
          root: true,
          overrides: [
            ...(data?.overrides ?? []),
            {
              files: ['**/*.{ts,tsx}'],
              extends: [
                'plugin:@mufan/typescript',
                ...(project.dev ? ['plugin:@mufan/dev'] : []),
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
