import * as Path from 'path';

import {composable, text} from '@magicspace/core';
import * as _ from 'lodash';

import type {ResolvedOptions} from '../library';

export default composable<ResolvedOptions>(
  async ({resolvedProjects: projects}) => {
    const packingTypeScriptProjectsDict = _.groupBy(
      projects.filter(project => !project.noEmit && !project.dev),
      project => project.package.packageJSONPath,
    );

    return Object.values(packingTypeScriptProjectsDict).map(projects => {
      const packageDir = projects[0].package.resolvedDir;

      return text(Path.join(packageDir, '.npmignore'), content => {
        return `${content}\
*
${projects
  .flatMap(project => [
    `!/${Path.posix.relative(packageDir, project.inDir)}/**/*.{ts,tsx}`,
    `!/${Path.posix.relative(packageDir, project.upperOutDir)}/**`,
  ])
  .join('\n')}
*.tsbuildinfo
`;
      });
    });
  },
);
