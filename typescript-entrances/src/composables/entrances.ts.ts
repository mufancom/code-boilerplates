import * as Path from 'path';

import {ComposableModuleFunction, handlebars} from '@magicspace/core';

import {TEMPLATES_DIR} from './@constants';
import {resolveTypeScriptProjectsWithEntrances} from './@utils';

const TEMPLATE_PATH = Path.join(TEMPLATES_DIR, '@entrances.ts.hbs');

const composable: ComposableModuleFunction = options => {
  let projects = resolveTypeScriptProjectsWithEntrances(options);

  return projects.flatMap(project => {
    return project.entrances.map(name =>
      handlebars(
        Path.join(project.srcDir, `${name}.ts`),
        {},
        {template: TEMPLATE_PATH},
      ),
    );
  });
};

export default composable;
