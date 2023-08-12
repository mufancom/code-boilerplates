import {composable, yaml} from '@magicspace/core';

import type {ResolvedOptions} from '../library';

export default composable<ResolvedOptions>(
  ({packageManager, packagesDir, packages}) => {
    if (packageManager !== 'pnpm') {
      return undefined;
    }

    if (packagesDir === undefined) {
      return;
    }

    return yaml({
      packages: packages.map(packageOptions => packageOptions.resolvedDir),
    });
  },
);
