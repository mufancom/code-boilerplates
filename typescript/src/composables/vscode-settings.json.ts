import {ComposableModuleFunction, json} from '@magicspace/core';
import {extendObjectProperties} from '@magicspace/utils';

import {resolveTypeScriptProjects} from '../library';

const composable: ComposableModuleFunction = async options => {
  let {projects} = resolveTypeScriptProjects(options);

  return json('.vscode/settings.json', (data: any) => {
    data = extendObjectProperties(
      data,
      {
        'typescript.sdk': 'node_modules/typescript/lib',
      },
      {
        before: 'eslint.*',
      },
    );

    data = extendObjectProperties(
      data,
      {
        'eslint.workingDirectories': [
          '.',
          ...projects.map(project => project.inDir),
        ],
      },
      {
        before: 'eslint.*',
      },
    );

    data['eslint.validate'] = [
      ...data['eslint.validate'],
      'typescript',
      'typescriptreact',
    ];

    return data;
  });
};

export default composable;
