import {join, posix} from 'path';

import {composable, objectModule} from '@magicspace/core';

import type {ResolvedOptions} from '../library/index.js';

const COMMENT = "/** @type {import('jest').Config} */";

export default composable<ResolvedOptions>(({mono, resolvedProjects}) => {
  const testProjects = resolvedProjects.filter(project => project.test);

  return [
    mono &&
      testProjects.length > 0 &&
      objectModule(
        'jest.config.js',
        {
          projects: Array.from(
            new Set(testProjects.map(project => project.package.resolvedDir)),
          ),
        },
        {
          type: 'module',
          comment: COMMENT,
        },
      ),
    ...testProjects.map(({bldDir, package: {resolvedDir}}) => {
      return objectModule(
        join(resolvedDir, 'jest.config.js'),
        (config: {testMatch?: string[]}) => {
          return {
            ...config,
            transform: {},
            testMatch: Array.from(
              new Set([
                ...(config?.testMatch ?? []),
                `<rootDir>/${posix.relative(resolvedDir, bldDir)}/**/*.test.js`,
              ]),
            ),
          };
        },
        {
          type: 'module',
          comment: COMMENT,
        },
      );
    }),
  ];
});
