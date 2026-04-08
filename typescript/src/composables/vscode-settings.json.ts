import {composable, json} from '@magicspace/core';

import type {ResolvedOptions} from '../library/index.js';

export default composable<ResolvedOptions>(() => {
  return json('.vscode/settings.json', (data: any) => {
    data['eslint.validate'] = [
      ...data['eslint.validate'],
      'typescript',
      'typescriptreact',
    ];

    return data;
  });
});
