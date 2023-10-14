import * as FS from 'fs';
import * as Path from 'path';

import {composable, handlebars} from '@magicspace/core';

import type {ResolvedOptions} from '../library/index.js';

import {LICENSE_TEMPLATES_DIR} from './@constants';

export default composable<ResolvedOptions>(({license, author}) => {
  if (!license) {
    return undefined;
  }

  const licenses = FS.readdirSync(LICENSE_TEMPLATES_DIR).map(fileName =>
    Path.basename(fileName, '.txt'),
  );

  if (!licenses.includes(license)) {
    console.warn(
      `No license boilerplate found for ${JSON.stringify(
        license,
      )}, use one of:`,
    );
    console.warn(licenses.map(license => `  - ${license}`).join('\n'));
    return undefined;
  }

  return handlebars(
    {
      year: new Date().getFullYear(),
      organization: author || '{{ organization }}',
    },
    {
      template: Path.join(LICENSE_TEMPLATES_DIR, `${license}.txt`),
      noEscape: true,
    },
  );
});
