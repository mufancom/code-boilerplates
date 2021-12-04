import {ComposableModuleFunction, json} from '@magicspace/core';
import _ from 'lodash';

const composable: ComposableModuleFunction = () => {
  return json('.eslintrc', (data: any) => {
    return {
      ...data,
      overrides: [
        ...data.overrides.map((override: any) => ({
          ...override,
          rules: {
            ' @mufan/scoped-modules': false,
          },
        })),
      ],
    };
  });
};

export default composable;
