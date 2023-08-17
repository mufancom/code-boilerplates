import type {Composable, TextFile} from '@magicspace/core';
import {composable, text} from '@magicspace/core';

import type {ResolvedOptions} from '../library';

const PACKAGE_MANAGER_IGNORE_ENTRIES_DICT = {
  pnpm: undefined,
  yarn: ['yarn-error.log'],
};

export default composable<ResolvedOptions>(({packageManager}) => {
  const composables: Composable<TextFile>[] = [
    text(
      '.gitignore',
      `\
# General
.DS_Store
*.tgz
node_modules/
`,
    ),
  ];

  const packageManagerIgnoreEntries =
    PACKAGE_MANAGER_IGNORE_ENTRIES_DICT[packageManager];

  if (packageManagerIgnoreEntries) {
    composables.push(
      text(
        '.gitignore',
        content => `${content}\
# Package Manager
${packageManagerIgnoreEntries.join('\n')}
`,
      ),
    );
  }

  return composables;
});
