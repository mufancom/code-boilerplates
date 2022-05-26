import type {ComposableModuleFunction} from '@magicspace/core';
import {json} from '@magicspace/core';

const DEFAULT_PRETTIER_OPTIONS: Magicspace.BoilerplateOptions.PrettierOptions =
  {
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

const composable: ComposableModuleFunction = options =>
  json('.prettierrc', options.prettier ?? DEFAULT_PRETTIER_OPTIONS);

export default composable;
