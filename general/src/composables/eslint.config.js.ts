import * as Path from 'node:path';

import {composable, handlebars} from '@magicspace/core';

import type {ResolvedOptions} from '../library/index.js';

import {TEMPLATES_DIR} from './@constants.js';

const TEMPLATE_PATH = Path.join(TEMPLATES_DIR, 'eslint.config.js.hbs');

export default composable<ResolvedOptions>(() => {
  return handlebars(
    'eslint.config.js',
    {
      configs: [
        `\
{
  files: ['**/*.{js,mjs,cjs}'],
  plugins: {'@mufan': mufan},
  extends: [configs.javascript],
},`,
        `\
{
  files: ['eslint.config.js'],
  plugins: {'@mufan': mufan},
  extends: [configs.dev],
},`,
      ],
    },
    {template: TEMPLATE_PATH, noEscape: true},
  );
});
