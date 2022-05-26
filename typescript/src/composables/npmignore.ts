import * as Path from 'path';

import type {ComposableModuleFunction} from '@magicspace/core';
import {text} from '@magicspace/core';
import * as _ from 'lodash';

import {resolveTypeScriptProjects} from '../library';

const composable: ComposableModuleFunction = async options => {
  let {projects} = resolveTypeScriptProjects(options);

  let packingTypeScriptProjectsDict = _.groupBy(
    projects.filter(project => !project.noEmit && !project.dev),
    project => project.package.packageJSONPath,
  );

  return Object.values(packingTypeScriptProjectsDict).map(projects => {
    let packageDir = projects[0].package.dir;

    return text(Path.join(packageDir, '.npmignore'), content => {
      return `${content}\
*
${projects
  .flatMap(project => [
    `!/${Path.posix.relative(packageDir, project.inDir)}/**/*.{ts,tsx}`,
    `!/${Path.posix.relative(packageDir, project.outDir)}/**`,
  ])
  .join('\n')}
*.tsbuildinfo
`;
    });
  });
};

export default composable;
