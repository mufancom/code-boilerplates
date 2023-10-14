import {composable, json} from '@magicspace/core';
import {extendObjectProperties} from '@magicspace/utils';

import type {ResolvedOptions} from '../library/index.js';

export default composable<ResolvedOptions>(
  async ({resolvedProjects: projects}) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return json('.vscode/settings.json', (data: any) => {
      data = extendObjectProperties(
        data,
        {
          'typescript.tsdk': 'node_modules/typescript/lib',
        },
        {
          before: 'eslint.*',
        },
      );

      data = extendObjectProperties(
        data,
        {
          'eslint.workingDirectories': [
            '.',
            ...projects.map(project => project.inDir),
          ],
        },
        {
          before: 'eslint.*',
        },
      );

      data['eslint.validate'] = [
        ...data['eslint.validate'],
        'typescript',
        'typescriptreact',
      ];

      return data;
    });
  },
);
