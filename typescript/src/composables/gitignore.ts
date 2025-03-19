import {composable, text} from '@magicspace/core';

import {textSegment} from '../../../general/bld/library/index.js';
import {type ResolvedOptions} from '../library/index.js';

export default composable<ResolvedOptions>(({bldDirNames}) =>
  bldDirNames.length > 0
    ? text(
        '.gitignore',
        textSegment(
          `\
# TypeScript Build Artifacts
${bldDirNames.map(bldDirName => `${bldDirName}/`).join('\n')}
*.tsbuildinfo`,
        ),
      )
    : undefined,
);
