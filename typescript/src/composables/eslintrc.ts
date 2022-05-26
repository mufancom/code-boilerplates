import * as Path from 'path';

import type {ComposableModuleFunction} from '@magicspace/core';
import {json} from '@magicspace/core';
import * as _ from 'lodash';

import {resolveTypeScriptProjects} from '../library';

const composable: ComposableModuleFunction = options => {
  let {projects} = resolveTypeScriptProjects(options);

  return [
    json('.eslintrc', (data: any) => {
      return {
        ...data,
        ignorePatterns: [
          ...new Set([
            ...(data.ignorePatterns ?? []),
            ...projects.flatMap(project => [
              ...(project.type === 'library' &&
              project.name !== 'library' &&
              project.exportAs
                ? [
                    `${project.package.dir ? `/${project.package.dir}` : ''}/${
                      project.name
                    }.d.ts`,
                  ]
                : []),
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
};

export default composable;
