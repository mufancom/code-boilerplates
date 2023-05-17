import * as Path from 'path';

import type {JSONFileOptions} from '@magicspace/core';
import {composable, json} from '@magicspace/core';
import {fetchPackageVersions} from '@magicspace/utils';

import type {ResolvedOptions} from '../library';

const JSON_OPTIONS: JSONFileOptions = {
  /** @link https://docs.npmjs.com/files/package.json */
  sortKeys: {
    top: [
      'name',
      'version',
      'private',
      'publishConfig',
      'description',
      'keywords',
      'homepage',
      'man',
      'bugs',
      'repository',
      'license',
      'author',
      'contributors',
      'type',
      'main',
      'browser',
      'module',
      'types',
      'bin',
      'files',
      'directories',
      'engines',
      'engineStrict',
      'os',
      'cpu',
    ],
    bottom: [
      'config',
      'scripts',
      'workspaces',
      {
        key: 'dependencies',
        subKeys: 'asc',
      },
      {
        key: 'bundledDependencies',
        subKeys: 'asc',
      },
      {
        key: 'bundleDependencies',
        subKeys: 'asc',
      },
      {
        key: 'optionalDependencies',
        subKeys: 'asc',
      },
      {
        key: 'peerDependencies',
        subKeys: 'asc',
      },
      {
        key: 'devDependencies',
        subKeys: 'asc',
      },
    ],
  },
};

const DEV_DEPENDENCY_DICT = {
  '@mufan/eslint-plugin': '0.1',
  eslint: '8',
  prettier: '2',
  'yarn-deduplicate': '6',
};

export default composable<ResolvedOptions>(
  async ({
    name,
    description,
    repository,
    author,
    license,
    packagesDir,
    packages,
  }) => {
    const common = {
      repository,
      author,
      license,
    };

    const devDependencies = await fetchPackageVersions(DEV_DEPENDENCY_DICT);

    return [
      json(
        'package.json',
        {
          name,
          description,
          scripts: {
            '3': 'yarn && yarn-deduplicate && yarn',
            lint: 'eslint --no-error-on-unmatched-pattern .',
            'lint-prettier': 'prettier --check .',
            test: 'yarn lint-prettier && yarn lint',
          },
          devDependencies,
          ...(packagesDir !== undefined
            ? {
                private: true,
                workspaces: packages.map(
                  packageOptions => packageOptions.resolvedDir,
                ),
              }
            : {}),
          ...common,
        },
        JSON_OPTIONS,
      ),
      ...packages.map(packageOptions =>
        json(
          Path.join(packageOptions.resolvedDir, 'package.json'),
          (data: any) => {
            return {
              ...data,
              ...common,
              name: packageOptions.name,
              version: '0.0.0',
            };
          },
          JSON_OPTIONS,
        ),
      ),
    ];
  },
);
