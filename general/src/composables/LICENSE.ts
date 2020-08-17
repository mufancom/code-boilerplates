import * as FS from 'fs';
import * as Path from 'path';

import {ComposableModuleFunction, handlebars} from '@magicspace/core';

import {LICENSE_TEMPLATES_DIR} from './@constants';

const composable: ComposableModuleFunction = ({license, author}) => {
  if (!license) {
    return undefined;
  }

  let licenses = FS.readdirSync(LICENSE_TEMPLATES_DIR).map(fileName =>
    Path.basename(fileName, '.txt'),
  );

  if (!licenses.includes(license)) {
    console.warn(
      `No license template found for ${JSON.stringify(license)}, use one of:`,
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
};

export default composable;
