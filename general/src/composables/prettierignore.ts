import {composable, text} from '@magicspace/core';

import type {ResolvedOptions} from '../library';

const PACKAGE_MANAGER_IGNORE_ENTRIES_DICT = {
  pnpm: ['pnpm-lock.yaml'],
  yarn: undefined,
};

export default composable<ResolvedOptions>(({packageManager}) => {
  const packageManagerIgnoreEntries =
    PACKAGE_MANAGER_IGNORE_ENTRIES_DICT[packageManager];

  if (!packageManagerIgnoreEntries) {
    return undefined;
  }

  return text(
    '.prettierignore',
    content => `${content}\
# Package Manager
${packageManagerIgnoreEntries.join('\n')}
`,
  );
});
