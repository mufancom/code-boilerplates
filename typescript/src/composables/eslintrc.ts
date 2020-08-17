import {ComposableModuleFunction, json} from '@magicspace/core';

import {resolveTypeScriptProjects} from '../library';

const composable: ComposableModuleFunction = options => {
  let {projects} = resolveTypeScriptProjects(options);

  let devProjects = projects.filter(project => project.dev);

  return json('.eslintrc', (data: any) => {
    return {
      ...data,
      overrides: [
        ...(data.overrides ?? []),
        {
          files: ['**/*.{ts,tsx}'],
          extends: ['plugin:@mufan/default'],
          parserOptions: {
            project: './**/tsconfig.json',
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
