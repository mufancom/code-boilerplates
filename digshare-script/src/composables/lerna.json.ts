import {ComposableModuleFunction, json} from '@magicspace/core';

const composable: ComposableModuleFunction = async options => {
  return [
    json('lerna.json', () => {
      return {
        npmClient: 'yarn',
        command: {
          publish: {
            npmClient: 'npm',
            registry: `${options.digshareScript.openAPI.host}/registry/`,
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
