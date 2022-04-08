import * as Path from 'path';

import {ComposableModuleFunction, handlebars} from '@magicspace/core';
import * as _ from 'lodash';

import {resolveTypeScriptProjects} from '../library';

import {TEMPLATES_DIR} from './@constants';

const TEMPLATE_PATH = Path.join(TEMPLATES_DIR, 'export.d.ts.hbs');

const composable: ComposableModuleFunction = options => {
  let {projects} = resolveTypeScriptProjects(options);

  return _.compact(
    projects.map(project =>
      project.type === 'library' && project.exportAs
        ? handlebars(
            Path.join(project.package.dir, `${project.name}.d.ts`),
            {
              module: JSON.stringify(
                `./${Path.posix.relative(project.package.dir, project.outDir)}`,
              ),
            },
            {template: TEMPLATE_PATH},
          )
        : undefined,
    ),
  );
};

export default composable;
