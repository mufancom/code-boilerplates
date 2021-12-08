import * as Path from 'path';

import {ComposableModuleFunction, handlebars} from '@magicspace/core';

import {TEMPLATES_DIR} from './@constants';

const TEMPLATE_PATH = Path.join(TEMPLATES_DIR, 'publish.js');

const composable: ComposableModuleFunction = () => {
  return handlebars(
    'publish.js',
    {},
    {
      template: TEMPLATE_PATH,
    },
  );
};

export default composable;
