import * as Path from 'path';

import type {ComposableModuleFunction} from '@magicspace/core';
import {handlebars} from '@magicspace/core';

import {resolveOptions} from '../library';

import {TEMPLATES_DIR} from './@constants';

const TEMPLATE_PATH = Path.join(TEMPLATES_DIR, 'README.md.hbs');

const composable: ComposableModuleFunction = options => {
  let data = {
    license: options.license,
  };

  let {packages} = resolveOptions(options);

  return [
    handlebars(
      'README.md',
      {
        name: options.name,
        ...data,
      },
      {
        template: TEMPLATE_PATH,
      },
    ),
    ...packages.map(packageOptions =>
      handlebars(
        Path.join(packageOptions.dir, 'README.md'),
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
};

export default composable;
