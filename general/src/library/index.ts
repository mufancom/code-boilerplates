/// <reference path="../../boilerplate.d.ts" />

import * as Path from 'path';

import * as _ from 'lodash';

export interface ResolvedPackageOptions
  extends Magicspace.BoilerplateOptions.PackageOptions {
  dir: string;
  packageJSONPath: string;
}

export interface ResolvedOptions extends Magicspace.BoilerplateOptions {
  packagesDir: string | undefined;
  packages: ResolvedPackageOptions[];
}

export function resolveOptions({
  packagesDir,
  packages,
  ...rest
}: Magicspace.BoilerplateOptions): ResolvedOptions {
  let resolvedPackages: ResolvedPackageOptions[];

  if (packages || packagesDir !== undefined) {
    if (packagesDir === undefined) {
      packagesDir = 'packages';
    }

    resolvedPackages = (packages ?? []).map(packageOptions => {
      const dir = Path.posix.join(
        packagesDir!,
        packageOptions.dir || packageOptions.name.replace(/^@[^/]+/, ''),
      );

      return {
        ...packageOptions,
        dir,
        packageJSONPath: Path.posix.join(dir, 'package.json'),
      };
    });
  } else {
    resolvedPackages = [
      {
        ..._.omit(rest, [
          'description',
          'repository',
          'license',
          'author',
          'prettier',
        ]),
        dir: '',
        packageJSONPath: 'package.json',
      },
    ];
  }

  return {
    packagesDir,
    packages: resolvedPackages,
    ...rest,
  };
}
