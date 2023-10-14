import * as Path from 'path';

import {composable, handlebars} from '@magicspace/core';

import type {ResolvedOptions} from '../library/index.js';

import {TEMPLATES_DIR} from './@constants';

const TEMPLATE_PATH = Path.join(TEMPLATES_DIR, '@entrances.ts.hbs');

export default composable<ResolvedOptions>(({resolvedProjects: projects}) => {
  return projects.flatMap(project =>
    project.entrances.map(name =>
      handlebars(
        Path.join(project.inDir, /\.tsx?$/.test(name) ? name : `${name}.ts`),
        {},
        {template: TEMPLATE_PATH},
      ),
    ),
  );
});
