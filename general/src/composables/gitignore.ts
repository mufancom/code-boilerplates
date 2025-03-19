import type {Composable, TextFile} from '@magicspace/core';
import {composable, text} from '@magicspace/core';

import {type ResolvedOptions, textSegment} from '../library/index.js';

const PACKAGE_MANAGER_IGNORE_ENTRIES_DICT = {
  pnpm: undefined,
  yarn: ['yarn-error.log'],
  npm: ['npm-debug.log'],
};

export default composable<ResolvedOptions>(({packageManager}) => {
  const composables: Composable<TextFile>[] = [
    text(
      '.gitignore',
      textSegment(`\
# General
.DS_Store
*.tgz
node_modules/`),
    ),
  ];

  const packageManagerIgnoreEntries =
    PACKAGE_MANAGER_IGNORE_ENTRIES_DICT[packageManager];

  if (packageManagerIgnoreEntries) {
    composables.push(
      text(
        '.gitignore',
        textSegment(`\
# Package Manager
${packageManagerIgnoreEntries.join('\n')}`),
      ),
    );
  }

  return composables;
});
