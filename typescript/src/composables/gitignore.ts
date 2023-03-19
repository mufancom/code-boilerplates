import {composable, text} from '@magicspace/core';

import type {ResolvedOptions} from '../library';

export default composable<ResolvedOptions>(({bldDirNames}) =>
  bldDirNames.length > 0
    ? text(
        '.gitignore',
        content => `${content}\
# TypeScript Build Artifacts
${bldDirNames.map(bldDirName => `${bldDirName}/`).join('\n')}
*.tsbuildinfo
`,
      )
    : undefined,
);
