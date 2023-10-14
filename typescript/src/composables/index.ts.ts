import * as Path from 'path';

import {composable, handlebars} from '@magicspace/core';
import _ from 'lodash';

import type {ResolvedOptions} from '../library/index.js';

import {TEMPLATES_DIR} from './@constants';

const TEMPLATE_PATH = Path.join(TEMPLATES_DIR, 'index.ts.hbs');

export default composable<ResolvedOptions>(({resolvedProjects: projects}) => {
  return _.compact(
    projects.map(project =>
      project.type === 'library'
        ? handlebars(
            Path.join(project.inDir, 'index.ts'),
            {},
            {template: TEMPLATE_PATH},
          )
        : undefined,
    ),
  );
});
