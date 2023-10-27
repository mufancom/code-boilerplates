import type {JSONFileOptions} from '@magicspace/core';
import {composable, json} from '@magicspace/core';

import type {ResolvedOptions} from '../library/index.js';

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

export default composable<ResolvedOptions>(({type}) => {
  const esm = type === 'module';

  return json(
    '.eslintrc.json',
    {
      root: true,
      ignorePatterns: ['node_modules/'],
      extends: ['plugin:@mufan/javascript'],
      overrides: [
        esm
          ? {
              files: '**/*.{js,mjs}',
              parserOptions: {
                sourceType: 'module',
              },
            }
          : {
              files: '**/*.{js,cjs}',
              parserOptions: {
                sourceType: 'script',
              },
            },
        esm
          ? {
              files: '**/*.cjs',
              parserOptions: {
                sourceType: 'script',
              },
            }
          : {
              files: '**/*.mjs',
              parserOptions: {
                sourceType: 'module',
              },
            },
      ],
    },
    JSON_OPTIONS,
  );
});
