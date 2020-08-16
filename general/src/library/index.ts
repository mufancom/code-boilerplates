// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../template-options.d.ts" />

import * as Path from 'path';

export interface ResolvedPackageOptions
  extends Magicspace.TemplateOptions.PackageOptions {
  dir: string;
}

export interface ResolvedOptions extends Magicspace.TemplateOptions {
  packagesDir: string;
  packages: ResolvedPackageOptions[];
}

export function resolveOptions({
  packagesDir = 'packages',
  packages = [],
  ...rest
}: Magicspace.TemplateOptions): ResolvedOptions {
  return {
    ...rest,
    packagesDir,
    packages: packages.map(packageOptions => {
      return {
        ...packageOptions,
        dir: Path.posix.join(
          packagesDir,
          packageOptions.dir || packageOptions.name.replace(/^@[^/]+/, ''),
        ),
      };
    }),
  };
}
