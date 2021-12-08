import {ComposableModuleFunction, json} from '@magicspace/core';

const composable: ComposableModuleFunction = async () => {
  return [
    json('lerna.json', () => {
      return {
        npmClient: 'yarn',
        command: {
          publish: {
            npmClient: 'npm',
            verifyAccess: false,
          },
        },
        packages: ['packages/*'],
        version: '0.1.0',
      };
    }),
  ];
};

export default composable;
