import {composable, yaml} from '@magicspace/core';

import type {ResolvedOptions} from '../library/index.js';

export default composable<ResolvedOptions>(
  ({defaultBranch, packageManager}) => {
    return yaml('.github/workflows/ci.yaml', {
      name: 'CI',
      on: {
        push: {
          branches: [defaultBranch],
        },
        pull_request: {
          branches: [defaultBranch],
        },
      },
      jobs: {
        test: {
          'runs-on': 'ubuntu-latest',
          container: 'node:20',
          steps: [
            {
              uses: 'actions/checkout@v3',
            },
            ...(packageManager === 'pnpm'
              ? [
                  {
                    run: 'npm install --global pnpm',
                  },
                ]
              : []),
            {
              run: `${packageManager} install`,
            },
            {
              run: `${packageManager} test`,
            },
          ],
        },
      },
    });
  },
);
