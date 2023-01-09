import * as Path from 'path';

import type {ComposableModuleFunction} from '@magicspace/core';
import {handlebars} from '@magicspace/core';
import * as _ from 'lodash';

import {resolveTypeScriptProjects} from '../library';

import {TEMPLATES_DIR} from './@constants';

const TEMPLATE_PATH = Path.join(TEMPLATES_DIR, 'index.ts.hbs');

const composable: ComposableModuleFunction = options => {
  const {projects} = resolveTypeScriptProjects(options);

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
};

export default composable;
