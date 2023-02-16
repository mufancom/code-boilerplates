import * as Path from 'path';

import {composable, handlebars} from '@magicspace/core';

import type {ResolvedOptions} from '../library';

import {TEMPLATES_DIR} from './@constants';

const TEMPLATE_PATH = Path.join(TEMPLATES_DIR, 'README.md.hbs');

export default composable<ResolvedOptions>(({name, license, packages}) => {
  const data = {
    license,
  };

  return [
    handlebars(
      'README.md',
      {
        name,
        ...data,
      },
      {
        template: TEMPLATE_PATH,
      },
    ),
    ...packages.map(packageOptions =>
      handlebars(
        Path.join(packageOptions.resolvedDir, 'README.md'),
        {
          name: packageOptions.name,
          ...data,
        },
        {
          template: TEMPLATE_PATH,
        },
      ),
    ),
  ];
});
