import * as Path from 'path';

import {ComposableModuleFunction, text} from '@magicspace/core';

import {resolveTypeScriptProjects} from '../../../typescript/bld/library';

const composable: ComposableModuleFunction = options => {
  let {projects} = resolveTypeScriptProjects(options);

  return projects.map(project =>
    text(Path.join(project.srcDir, '.npmrc'), content => content ?? ''),
  );
};

export default composable;
