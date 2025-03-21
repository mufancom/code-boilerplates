import * as Path from 'path';

import type {JSONFileOptions} from '@magicspace/core';
import {composable, json} from '@magicspace/core';
import {fetchPackageVersions} from '@magicspace/utils';

import type {ResolvedOptions} from '../library/index.js';

const hasOwnProperty = Object.prototype.hasOwnProperty;

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
  '@mufan/eslint-plugin': '0.2',
  eslint: '8',
  prettier: '3',
};

const PACKAGE_MANAGER_DEV_DEPENDENCY_DICT = {
  pnpm: {},
  yarn: {
    'yarn-deduplicate': '6',
  },
  npm: {},
};

const SCRIPT_3_DICT = {
  pnpm: 'pnpm install && pnpm dedupe && pnpm install',
  yarn: 'yarn && yarn-deduplicate && yarn',
  npm: 'npm install && npm dedupe && npm install',
};

const WORKSPACE_ALIAS_DICT = {
  pnpm(name: string): string {
    return `pnpm --filter ${name}`;
  },
  yarn(name: string): string {
    return `yarn workspace ${name}`;
  },
  npm(name: string): string {
    return `npm run --workspace ${name}`;
  },
};

export default composable<ResolvedOptions>(
  async ({
    name,
    description,
    repository,
    author,
    license,
    type,
    packageManager,
    mono,
    packages,
    packagesSortedByName,
  }) => {
    const common = {
      repository,
      author,
      license,
    };

    const devDependencies = await fetchPackageVersions({
      ...DEV_DEPENDENCY_DICT,
      ...PACKAGE_MANAGER_DEV_DEPENDENCY_DICT[packageManager],
    });

    const scripts: Record<string, string> = {
      '3': SCRIPT_3_DICT[packageManager],
      lint: 'eslint --no-error-on-unmatched-pattern --report-unused-disable-directives .',
      'lint-prettier': 'prettier --check .',
      test: 'npm run lint-prettier && npm run lint',
    };

    for (const {name, alias} of packagesSortedByName) {
      if (alias !== undefined && !hasOwnProperty.call(scripts, alias)) {
        scripts[alias] = WORKSPACE_ALIAS_DICT[packageManager](name);
      }
    }

    return [
      json(
        'package.json',
        {
          name,
          description,
          type,
          scripts,
          devDependencies,
          ...(mono && {
            private: true,
            ...(packageManager === 'yarn' && {
              workspaces: packagesSortedByName.map(
                packageOptions => packageOptions.resolvedDir,
              ),
            }),
          }),
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
              type: packageOptions.type ?? type,
            };
          },
          JSON_OPTIONS,
        ),
      ),
    ];
  },
);
