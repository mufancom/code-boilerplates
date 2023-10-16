import * as FS from 'fs/promises';
import * as Path from 'path';

import {composable, text} from '@magicspace/core';

import type {ResolvedOptions} from '../library/index.js';

const PACKAGE_MANAGER_IGNORE_ENTRIES_DICT = {
  pnpm: ['pnpm-lock.yaml'],
  yarn: undefined,
};

const BOILERPLATE_SCHEMA_FILE_NAME = 'boilerplate.schema.json';

export default composable<ResolvedOptions>(
  async ({packageManager, magicspaceDir}) => {
    const packageManagerIgnoreEntries =
      PACKAGE_MANAGER_IGNORE_ENTRIES_DICT[packageManager];

    if (!packageManagerIgnoreEntries) {
      return undefined;
    }

    const boilerplateSchemaExists = await FS.stat(
      Path.join(magicspaceDir, BOILERPLATE_SCHEMA_FILE_NAME),
    ).then(
      stats => stats.isFile(),
      () => false,
    );

    return text('.prettierignore', content => {
      if (boilerplateSchemaExists) {
        content += `\
# Magicspace
${BOILERPLATE_SCHEMA_FILE_NAME}
`;
      }

      content += `\
# Package Manager
${packageManagerIgnoreEntries.join('\n')}
`;

      return content;
    });
  },
);
