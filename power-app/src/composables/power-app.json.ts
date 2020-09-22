import {ComposableModuleFunction, json} from '@magicspace/core';

const composable: ComposableModuleFunction = async ({
  name,
  powerApp: {port},
}) => {
  return [
    json('power-app.json', (data: any) => {
      return {
        ...data,
        name,
        version: '0.1.0',
        displayName: 'PowerApp',
        hookBaseURL: `http://power-apps.makeflow.com/${name}/app`,
      };
    }),
    json('power-app.dev.json', (data: any) => {
      return {
        ...data,
        name,
        version: '0.1.0',
        displayName: 'PowerApp',
        hookBaseURL: `http://localhost:${port}`,
      };
    }),
  ];
};

export default composable;
