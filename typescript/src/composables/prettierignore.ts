import {composable, text} from '@magicspace/core';

import type {ResolvedOptions} from '../library/index.js';

export default composable<ResolvedOptions>(({bldDirNames}) =>
  bldDirNames.length > 0
    ? text(
        '.prettierignore',
        content => `${content}\
# TypeScript Build Artifacts
${bldDirNames.map(bldDirName => `${bldDirName}/`).join('\n')}
`,
      )
    : undefined,
);
