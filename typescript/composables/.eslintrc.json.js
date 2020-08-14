const Path = require('path');

const {json} = require('@magicspace/core');

const {resolveProjectOptions} = require('../@utils');

const JSON_OPTIONS = {
  sortKeys: [],
};

module.exports = async ({project}) => {
  let {packages} = resolveProjectOptions(project);

  return [
    ...packages.map(package =>
      json(
        Path.join(package.dir, '.eslintrc'),
        {
          root: true,
          overrides: [
            {
              files: ['**/*.{ts,tsx}'],
              extends: ['plugin:@magicspace/default'],
              parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: '.',
              },
            },
          ],
        },
        JSON_OPTIONS,
      ),
    ),
  ];
};
