import {composable, yaml} from '@magicspace/core';

import type {ResolvedOptions} from '../library/index.js';

export default composable<ResolvedOptions>(
  ({packageManager, mono, packages}) => {
    if (packageManager !== 'pnpm') {
      return undefined;
    }

    if (!mono) {
      return;
    }

    return yaml({
      packages: packages.map(packageOptions => packageOptions.resolvedDir),
    });
  },
);
