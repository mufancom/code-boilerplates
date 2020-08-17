import {JSONFileOptions, json} from '@magicspace/core';

const JSON_OPTIONS: JSONFileOptions = {
  /** @link https://eslint.org/docs/user-guide/configuring */
  sortKeys: [
    'root',
    'noInlineConfig',
    'reportUnusedDisableDirectives',
    'ignorePatterns',
    'plugins',
    'extends',
    'processor',
    'env',
    'parser',
    'parserOptions',
    'globals',
    'rules',
    'settings',
    'overrides',
  ],
  // Add space to hint prettier so that it won't make short object literal like
  // `env` below a single line.
  space: 2,
};

export default json(
  '.eslintrc',
  {
    root: true,
    extends: ['eslint:recommended'],
    env: {
      node: true,
      es2020: true,
    },
  },
  JSON_OPTIONS,
);
