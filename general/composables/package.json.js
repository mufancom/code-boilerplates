const Path = require('path');

const {json} = require('@magicspace/core');
const latestVersion = require('latest-version');

const {resolveOptions} = require('../@utils');

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

module.exports = async options => {
  let {name, repository, author, license, packages} = resolveOptions(options);

  let common = {
    repository,
    author,
    license,
  };

  console.info('Fetching dependency versions...');

  let devDependencies = Object.fromEntries(
    await Promise.all(
      Object.entries(DEV_DEPENDENCY_DICT).map(async ([name, versionRange]) => [
        name,
        `^${await latestVersion(name, versionRange)}`,
      ]),
    ),
  );

  return [
    json(
      'package.json',
      {
        name,
        scripts: {
          lint: 'eslint .',
          'lint-prettier':
            'prettier --list-different "**/*.{ts,tsx,js,jsx,json,md}"',
          test: 'yarn lint-prettier && yarn lint',
        },
        devDependencies,
        ...(packages.length
          ? {
              private: true,
              workspaces: packages.map(package => package.dir),
            }
          : {
              version: '0.0.0',
            }),
        ...common,
      },
      JSON_OPTIONS,
    ),
    ...packages.map(package =>
      json(
        Path.join(package.dir, 'package.json'),
        {
          name: package.name,
          version: '0.0.0',
          ...common,
        },
        JSON_OPTIONS,
      ),
    ),
  ];
};
