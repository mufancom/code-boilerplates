import * as Path from 'path';

import {composable, text} from '@magicspace/core';
import _ from 'lodash';

import {textSegment} from '../../../general/bld/library/index.js';
import type {ResolvedOptions} from '../library/index.js';

export default composable<ResolvedOptions>(
  async ({resolvedProjects: projects}) => {
    const packingTypeScriptProjectsDict = _.groupBy(
      projects.filter(project => !project.noEmit && !project.dev),
      project => project.package.packageJSONPath,
    );

    return Object.values(packingTypeScriptProjectsDict).map(projects => {
      const packageDir = projects[0].package.resolvedDir;

      return text(
        Path.join(packageDir, '.npmignore'),
        textSegment(
          `\
*
${projects
  .flatMap(project => [
    `!/${Path.posix.relative(packageDir, project.inDir)}/**/*.{ts,tsx}`,
    `!/${Path.posix.relative(packageDir, project.outDir)}/**`,
  ])
  .join('\n')}
*.tsbuildinfo`,
        ),
      );
    });
  },
);
