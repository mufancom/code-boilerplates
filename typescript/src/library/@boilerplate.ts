import * as Path from 'path';

import {boilerplate, composables} from '@magicspace/core';

import general from '../../../general/bld/library/index.js';

import type {Options} from './options.js';
import {resolveOptions} from './options.js';

export default boilerplate<Options>(async (options, context) => {
  return {
    extends: await general(options, context),
    composables: await composables(
      Path.join(__dirname, '../composables'),
      resolveOptions(options, context),
    ),
  };
});
