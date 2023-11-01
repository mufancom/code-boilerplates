import * as Path from 'path';
import {fileURLToPath} from 'url';

import type {BoilerplateBuilderContext} from '@magicspace/core';
import {boilerplate, composables, x} from '@magicspace/core';
import _ from 'lodash';

export default boilerplate<Options>(async (options, context) => {
  return {
    composables: await composables(
      {
        root: Path.join(fileURLToPath(import.meta.url), '../../composables'),
        pattern: '(?!@)*.js',
      },
      resolveOptions(options, context),
    ),
    scripts: {
      postgenerate: 'prettier --write .',
    },
  };
});

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

const BadgesOptions = x.object({
  npm: x.boolean.optional(),
  repo: x.boolean.optional(),
  coverage: x.boolean.optional(),
  license: x.boolean.optional(),
  discord: x.string.optional(),
});

export type BadgesOptions = x.TypeOf<typeof BadgesOptions>;

export const PackageType = x.union([
  x.literal('module'),
  x.literal('commonjs'),
]);

export type PackageType = x.TypeOf<typeof PackageType>;

export const PackageOptions = x.object({
  name: x.string,
  type: PackageType.optional(),
  dir: x.string
    .nominal({
      description:
        'Directory name of this package, defaults to package name ("@*/" removed if any).',
    })
    .optional(),
  badges: BadgesOptions.optional(),
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
  type: PackageType,
  description: x.string.optional(),
  repository: x.string.optional(),
  license: LicenseName.optional(),
  author: x.string.optional(),
  badges: BadgesOptions.optional(),
  defaultBranch: x.string,
  packageManager: x.union([x.literal('pnpm'), x.literal('yarn')]),
  packagesDir: x.string
    .nominal({
      description: 'Name of the packages directory, defaults to "packages".',
    })
    .optional(),
  packages: x.array(PackageOptions).optional(),
  prettier: PrettierOptions.optional(),
});

export type Options = x.TypeOf<typeof Options>;

export type ResolvedPackageOptions = {
  type: PackageType;
  alias?: string;
  resolvedDir: string;
  packageJSONPath: string;
} & PackageOptions;

export type ResolvedOptions = {
  defaultBranch: string;
  packageManager: 'pnpm' | 'yarn';
  packagesDir: string | undefined;
  packages: ResolvedPackageOptions[];
  packagesSortedByName: ResolvedPackageOptions[];
  packagesSortedByAlias: ResolvedPackageOptions[];
} & Options &
  BoilerplateBuilderContext;

export function resolveOptions<TOptions extends Options>(
  options: TOptions,
  context: BoilerplateBuilderContext,
): TOptions & ResolvedOptions;
export function resolveOptions(
  {
    name,
    type,
    defaultBranch = 'main',
    packageManager = 'yarn',
    packagesDir,
    packages,
    ...rest
  }: Options,
  context: BoilerplateBuilderContext,
): ResolvedOptions {
  let resolvedPackages: ResolvedPackageOptions[];

  if (packages || packagesDir !== undefined) {
    if (packagesDir === undefined) {
      packagesDir = 'packages';
    }

    resolvedPackages = (packages ?? []).map(packageOptions => {
      const alias = packageOptions.name.replace(/^@[^/]+\//, '');

      const resolvedDir = Path.posix.join(
        packagesDir!,
        packageOptions.dir || alias,
      );

      return {
        type,
        ...packageOptions,
        alias,
        resolvedDir,
        packageJSONPath: Path.posix.join(resolvedDir, 'package.json'),
      };
    });
  } else {
    resolvedPackages = [
      {
        name,
        type,
        resolvedDir: '',
        packageJSONPath: 'package.json',
        ...rest,
      },
    ];
  }

  return {
    name,
    type,
    defaultBranch,
    packageManager,
    packagesDir,
    packages: resolvedPackages,
    packagesSortedByName: _.sortBy(
      resolvedPackages,
      packageOptions => packageOptions.name,
    ),
    packagesSortedByAlias: _.sortBy(
      resolvedPackages,
      packageOptions => packageOptions.alias ?? '',
    ),
    ...context,
    ...rest,
  };
}
