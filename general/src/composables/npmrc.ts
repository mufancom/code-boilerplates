import {composable, text} from '@magicspace/core';

import {type ResolvedOptions, textSegment} from '../library/index.js';

export default composable<ResolvedOptions>(({packageManager}) => {
  if (packageManager !== 'pnpm') {
    return undefined;
  }

  return text('.npmrc', textSegment('public-hoist-pattern[]=*eslint-plugin*'));
});
