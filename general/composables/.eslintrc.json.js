const {json} = require('@magicspace/core');

const JSON_OPTIONS = {
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
};

module.exports = () => {
  return json(
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
};
