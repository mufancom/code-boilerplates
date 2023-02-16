import * as Path from 'path';

import {boilerplate, composables} from '@magicspace/core';

import general from '../../../general/bld/library';

import type {Options} from './options';
import {resolveOptions} from './options';

export default boilerplate<Options>(async options => {
  return {
    extends: await general(options),
    composables: await composables(
      Path.join(__dirname, '../composables'),
      resolveOptions(options),
    ),
  };
});
