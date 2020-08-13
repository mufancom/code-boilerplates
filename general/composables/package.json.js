const Path = require('path');

const {json} = require('@magicspace/core');

const {resolveProjectOptions} = require('../@utils');

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

module.exports = ({project}) => {
  let {name, packages} = resolveProjectOptions(project);

  return [
    json(
      'package.json',
      {
        name,
        ...(packages.length
          ? {
              private: true,
              workspaces: packages.map(package => package.dir),
            }
          : {
              version: '0.0.0',
            }),
      },
      JSON_OPTIONS,
    ),
    ...packages.map(package =>
      json(
        Path.join(package.dir, 'package.json'),
        {
          name: package.name,
          version: '0.0.0',
        },
        JSON_OPTIONS,
      ),
    ),
  ];
};
