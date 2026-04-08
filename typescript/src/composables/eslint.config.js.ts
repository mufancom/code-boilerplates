import * as Path from 'node:path';

import {composable, handlebars} from '@magicspace/core';

import type {ResolvedOptions} from '../library/index.js';

import {TEMPLATES_DIR} from './@constants.js';

const TEMPLATE_PATH = Path.join(TEMPLATES_DIR, 'eslint.config.js.hbs');

export default composable<ResolvedOptions>(({resolvedProjects: projects}) => {
  const globalIgnores = Array.from(
    new Set(
      projects.flatMap(project =>
        project.noEmit ? [] : [`${project.bldDir}/`],
      ),
    ),
  );

  const configs = projects.flatMap(project => {
    const projectConfigs = [
      `\
{
  files: ${JSON.stringify([Path.posix.join(project.inDir, '**/*.{ts,tsx}')])},
  plugins: {'@mufan': mufan},
  extends: [
${['configs.typescript', ...(project.dev ? ['configs.dev'] : [])]
  .map(config => `    ${config},`)
  .join('\n')}
  ],
  languageOptions: {
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
},`,
    ];

    if (project.test && !project.dev) {
      projectConfigs.push(`\
{
  files: ${JSON.stringify([Path.posix.join(project.inDir, '**/*.test.{ts,tsx}')])},
  extends: [configs.dev],
},`);
    }

    return `\
// ${project.inDir}
${projectConfigs.join('\n')}`;
  });

  return handlebars(
    'eslint.config.js',
    (data: any) => {
      return {
        globalIgnoresJSON:
          globalIgnores.length > 0 ? JSON.stringify(globalIgnores) : undefined,
        configs: [...data.configs, ...configs],
      };
    },
    {template: TEMPLATE_PATH, noEscape: true},
  );
});
