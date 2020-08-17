import * as Path from 'path';

import {ComposableModuleFunction, handlebars} from '@magicspace/core';

import {TEMPLATES_DIR} from './@constants';

const composable: ComposableModuleFunction = options =>
  handlebars(options, {
    template: Path.join(TEMPLATES_DIR, 'README.md.hbs'),
  });

export default composable;
