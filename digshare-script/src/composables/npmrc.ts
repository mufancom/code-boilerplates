import * as Path from 'path';

import {ComposableModuleFunction, text} from '@magicspace/core';

import {resolveOptions} from '../../../general/bld/library';

const composable: ComposableModuleFunction = options => {
  return [
    ...resolveOptions(options).packages.map(packageOptions =>
      text(
        Path.join(packageOptions.dir, '.npmrc'),
        () =>
          `${options.digshareScript.openAPI.host}/registry/:_authToken=${packageOptions.registry}`,
      ),
    ),
  ];
};

export default composable;
