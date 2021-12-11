import * as Path from 'path';

import {ComposableModuleFunction, handlebars} from '@magicspace/core';

import {resolveTypeScriptProjects} from '../../../typescript/bld/library';

import {TEMPLATES_DIR} from './@constants';

const TEMPLATE_PATH = Path.join(TEMPLATES_DIR, 'index.ts.hbs');

const composable: ComposableModuleFunction = options => {
  let {projects} = resolveTypeScriptProjects(options);

  return projects.map(project =>
    handlebars(
      Path.join(project.srcDir, 'index.ts'),
      {},
      {
        template: TEMPLATE_PATH,
      },
    ),
  );
};

export default composable;
