import type {ComposableModuleFunction} from '@magicspace/core';
import {json} from '@magicspace/core';

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
        hookBaseURL: `https://power-apps.makeflow.com/${name}/api`,
      };
    }),
    json('power-app.dev.json', (data: any) => {
      return {
        ...data,
        name,
        version: '0.1.0',
        hookBaseURL: `http://localhost:${port}/api`,
      };
    }),
  ];
};

export default composable;
