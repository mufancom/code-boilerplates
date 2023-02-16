import {composable, json} from '@magicspace/core';

import type {PrettierOptions, ResolvedOptions} from '../library';

const DEFAULT_PRETTIER_OPTIONS: PrettierOptions = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  jsxSingleQuote: false,
  trailingComma: 'all',
  bracketSpacing: false,
  bracketSameLine: false,
  arrowParens: 'avoid',
};

export default composable<ResolvedOptions>(options =>
  json('.prettierrc', options.prettier ?? DEFAULT_PRETTIER_OPTIONS),
);
