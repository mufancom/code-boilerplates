import * as Path from 'path';

import {ComposableModuleFunction, json} from '@magicspace/core';
import {fetchPackageVersions} from '@magicspace/utils';

import {resolveOptions} from '../library';

const JSON_OPTIONS = {
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
      'dependencies',
      'bundledDependencies',
      'bundleDependencies',
      'optionalDependencies',
      'peerDependencies',
      'devDependencies',
    ],
  },
};

const DEV_DEPENDENCY_DICT = {
  eslint: '7',
  prettier: '2',
};

const composable: ComposableModuleFunction = async options => {
  let {name, repository, author, license, packages} = resolveOptions(options);

  let common = {
    repository,
    author,
    license,
  };

  let devDependencies = await fetchPackageVersions(DEV_DEPENDENCY_DICT);

  return [
    json(
      'package.json',
      {
        name,
        scripts: {
          lint: 'eslint .',
          'lint-prettier': 'prettier --check .',
          test: 'yarn lint-prettier && yarn lint',
        },
        devDependencies,
        ...(packages.length
          ? {
              private: true,
              workspaces: packages.map(packageOptions => packageOptions.dir),
            }
          : {
              version: '0.0.0',
            }),
        ...common,
      },
      JSON_OPTIONS,
    ),
    ...packages.map(packageOptions =>
      json(
        Path.posix.join(packageOptions.dir, 'package.json'),
        {
          name: packageOptions.name,
          version: '0.0.0',
          ...common,
        },
        JSON_OPTIONS,
      ),
    ),
  ];
};

export default composable;
