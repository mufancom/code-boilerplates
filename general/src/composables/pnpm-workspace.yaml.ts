import {composable, yaml} from '@magicspace/core';

import type {ResolvedOptions} from '../library/index.js';

export default composable<ResolvedOptions>(
  ({packageManager, mono, packages}) => {
    if (packageManager !== 'pnpm') {
      return undefined;
    }

    return yaml({
      ...(mono && {
        packages: packages.map(packageOptions => packageOptions.resolvedDir),
      }),
      publicHoistPattern: ['*eslint-plugin*'],
    });
  },
);
