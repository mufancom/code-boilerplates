import {ComposableModuleFunction, json} from '@magicspace/core';
import _ from 'lodash';

import {resolveTypeScriptProjects} from '../library';

const composable: ComposableModuleFunction = options => {
  let {projects} = resolveTypeScriptProjects(options);

  let devProjects = projects.filter(project => project.dev);

  return json('.eslintrc', (data: any) => {
    return {
      ...data,
      ignorePatterns: _.union(_.castArray(data.ignorePatterns ?? []), [
        'bld',
        '.bld-cache',
      ]),
      overrides: [
        ...(data.overrides ?? []),
        {
          files: ['**/*.{ts,tsx}'],
          extends: ['plugin:@mufan/default'],
          parserOptions: {
            project: '!(node_modules)/**/tsconfig.json',
          },
        },
        ...devProjects.map(project => {
          return {
            files: [`${project.srcDir}/**/*.{ts,tsx}`],
            extends: ['plugin:@mufan/override-dev'],
          };
        }),
      ],
    };
  });
};

export default composable;
