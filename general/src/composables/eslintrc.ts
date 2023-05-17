import type {JSONFileOptions} from '@magicspace/core';
import {json} from '@magicspace/core';

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
};

export default json(
  '.eslintrc.json',
  {
    root: true,
    ignorePatterns: ['node_modules/'],
    extends: ['plugin:@mufan/js'],
    overrides: [
      {files: '**/*.{js,jsx}'},
      {
        files: '**/*.cjs',
        parserOptions: {
          sourceType: 'script',
        },
      },
    ],
  },
  JSON_OPTIONS,
);
