const {json} = require('@magicspace/core');

const JSON_OPTIONS = {
  sortKeys: [
    'root',
    'ignorePatterns',
    'extends',
    'env',
    'parserOptions',
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
