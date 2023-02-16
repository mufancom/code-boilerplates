import * as Path from 'path';

import {composable, handlebars} from '@magicspace/core';
import * as _ from 'lodash';

import type {ResolvedOptions} from '../library';

import {TEMPLATES_DIR} from './@constants';

const TEMPLATE_PATH = Path.join(TEMPLATES_DIR, 'index.ts.hbs');

export default composable<ResolvedOptions>(({resolvedTSProjects: projects}) => {
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
