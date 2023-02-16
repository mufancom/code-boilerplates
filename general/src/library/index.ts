import * as Path from 'path';

import type {BoilerplateExample} from '@magicspace/core';
import {boilerplate, composables, x} from '@magicspace/core';

export default boilerplate<Options>(async options => {
  const c = await composables(
    {
      root: Path.join(__dirname, '../composables'),
      pattern: '(?!@)*.js',
    },
    resolveOptions(options),
  );

  return {
    composables: c,
    scripts: {
      postgenerate: 'prettier --write .',
    },
  };
});

export const examples: BoilerplateExample[] = [
  {
    name: 'basic',
    description: 'basic usage',
    options: {
      name: 'awesome-project',
      license: 'MIT',
      author: 'Awesome Author',
    },
  },
  {
    name: 'multiple packages',
    description: 'multiple packages with workspaces',
    options: {
      name: 'awesome-project',
      license: 'MIT',
      author: 'Awesome Author',
      packages: [
        {
          name: '@awesome/server',
        },
        {
          name: '@awesome/client',
        },
      ],
    },
  },
];

export const LicenseName = x.union([
  x.literal('Apache-2.0'),
  x.literal('BSD-2-Clause'),
  x.literal('BSD-3-Clause'),
  x.literal('ISC'),
  x.literal('MIT'),
  x.literal('MPL-2.0'),
  x.literal('Unlicense'),
  x.literal('WTFPL'),
]);

export type LicenseName = x.TypeOf<typeof LicenseName>;

export const PackageOptions = x.object({
  name: x.string,
  dir: x.string.optional(),
});

export type PackageOptions = x.TypeOf<typeof PackageOptions>;

export const PrettierOptions = x.object({
  printWidth: x.number,
  tabWidth: x.number,
  useTabs: x.boolean,
  semi: x.boolean,
  singleQuote: x.boolean,
  quoteProps: x.union([
    x.literal('as-needed'),
    x.literal('consistent'),
    x.literal('preserve'),
  ]),
  jsxSingleQuote: x.boolean,
  trailingComma: x.union([
    x.literal('es5'),
    x.literal('none'),
    x.literal('all'),
  ]),
  bracketSpacing: x.boolean,
  bracketSameLine: x.boolean,
  arrowParens: x.union([x.literal('always'), x.literal('avoid')]),
});

export type PrettierOptions = x.TypeOf<typeof PrettierOptions>;

export const Options = x.object({
  name: x.string,
  description: x.string.optional(),
  repository: x.string.optional(),
  license: LicenseName.optional(),
  author: x.string.optional(),
  packagesDir: x.string.optional(),
  packages: x.array(PackageOptions).optional(),
  prettier: PrettierOptions.optional(),
});

export type Options = x.TypeOf<typeof Options>;

export interface ResolvedPackageOptions extends PackageOptions {
  resolvedDir: string;
  packageJSONPath: string;
}

export interface ResolvedOptions extends Options {
  packagesDir: string | undefined;
  packages: ResolvedPackageOptions[];
}

export function resolveOptions<TOptions extends Options>({
  name,
  packagesDir,
  packages,
  ...rest
}: TOptions): TOptions & ResolvedOptions;
export function resolveOptions({
  name,
  packagesDir,
  packages,
  ...rest
}: Options): ResolvedOptions {
  let resolvedPackages: ResolvedPackageOptions[];

  if (packages || packagesDir !== undefined) {
    if (packagesDir === undefined) {
      packagesDir = 'packages';
    }

    resolvedPackages = (packages ?? []).map(packageOptions => {
      const resolvedDir = Path.posix.join(
        packagesDir!,
        packageOptions.dir || packageOptions.name.replace(/^@[^/]+/, ''),
      );

      return {
        ...packageOptions,
        resolvedDir,
        packageJSONPath: Path.posix.join(resolvedDir, 'package.json'),
      };
    });
  } else {
    resolvedPackages = [
      {
        name,
        resolvedDir: '',
        packageJSONPath: 'package.json',
        ...rest,
      },
    ];
  }

  return {
    name,
    packagesDir,
    packages: resolvedPackages,
    ...rest,
  };
}
