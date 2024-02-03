import {join, posix} from 'path';

import {composable, objectModule} from '@magicspace/core';

import type {ResolvedOptions} from '../library/index.js';

const COMMENT = "/** @type {import('jest').Config} */";

export default composable<ResolvedOptions>(({type, mono, resolvedProjects}) => {
  const testProjects = resolvedProjects.filter(project => project.test);

  return [
    mono &&
      testProjects.length > 0 &&
      objectModule(
        'jest.config.js',
        {
          projects: testProjects.map(project => project.package.resolvedDir),
        },
        {
          type,
          comment: COMMENT,
        },
      ),
    ...testProjects.map(({bldDir, package: {type, resolvedDir}}) => {
      return objectModule(
        join(resolvedDir, 'jest.config.js'),
        (config: {testMatch?: string[]}) => {
          return {
            ...config,
            transform: {},
            testMatch: [
              ...(config?.testMatch ?? []),
              `<rootDir>/${posix.relative(resolvedDir, bldDir)}/test/*.test.js`,
            ],
          };
        },
        {
          type,
          comment: COMMENT,
        },
      );
    }),
  ];
});
