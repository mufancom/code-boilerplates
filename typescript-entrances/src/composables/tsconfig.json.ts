import {ComposableModuleFunction, json} from '@magicspace/core';

import {resolveTypeScriptProjectsWithEntrances} from './@utils';

const composable: ComposableModuleFunction = options => {
  let projects = resolveTypeScriptProjectsWithEntrances(options);

  return projects.map(project => {
    return json(project.tsconfigPath, (data: any) => {
      return {
        ...data,
        compilerOptions: {
          ...data.compilerOptions,
          experimentalDecorators: true,
        },
      };
    });
  });
};

export default composable;
