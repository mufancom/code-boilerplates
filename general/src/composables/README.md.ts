import * as Path from 'path';

import {Project, handlebars} from '@magicspace/core';

import {TEMPLATES_DIR} from './@constants';

const composable: Project.ComposableModuleFunction = options =>
  handlebars(options, {
    template: Path.join(TEMPLATES_DIR, 'README.md.hbs'),
  });

export default composable;
