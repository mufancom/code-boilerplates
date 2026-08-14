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
      permissions: {
        contents: 'read',
      },
      jobs: {
        test: {
          'runs-on': 'ubuntu-latest',
          steps: [
            {
              uses: 'actions/checkout@v6',
            },
            {
              name: 'Set up Node.js',
              uses: 'actions/setup-node@v7',
              with: {
                'node-version': '24',
              },
            },
            ...(packageManager === 'pnpm'
              ? [
                  {
                    run: 'npm install --global pnpm',
                  },
                ]
              : []),
            {
              run:
                packageManager === 'npm'
                  ? 'npm ci'
                  : `${packageManager} install --frozen-lockfile`,
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
