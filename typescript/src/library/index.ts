/// <reference path="../../boilerplate.d.ts" />

import * as Path from 'path';

import {OmitValueOfKey} from 'tslang';

import {
  ResolvedOptions,
  ResolvedPackageOptions,
  resolveOptions,
} from '../../../general/bld/library';

export interface ResolvedTypeScriptProjectOptions
  extends OmitValueOfKey<
    Magicspace.BoilerplateOptions.TypeScriptProjectOptions,
    keyof Magicspace.BoilerplateOptions.TypeScriptProjectBaseOptions
  > {
  srcDir: string;
  outDir: string;
  tsconfigPath: string;
  type: 'library' | 'program' | 'script';
  dev: boolean;
  noEmit: boolean;
  package: ResolvedPackageOptions;
}

export interface ResolveTypeScriptProjectsResult {
  projects: ResolvedTypeScriptProjectOptions[];
  package: ResolvedOptions;
}

export function resolveTypeScriptProjects(
  options: Magicspace.BoilerplateOptions,
): ResolveTypeScriptProjectsResult {
  let packageOptions = resolveOptions(options);

  return {
    projects: [
      ...packageOptions.packages.flatMap(
        packageOptions =>
          packageOptions.tsProjects?.map(project =>
            buildResolvedTypeScriptProjectOptions(project, packageOptions),
          ) ?? [],
      ),
    ],
    package: packageOptions,
  };
}

function buildResolvedTypeScriptProjectOptions(
  {
    name,
    type = name && name.includes('library') ? 'library' : 'program',
    dev = (name && name.includes('test')) || type === 'script' ? true : false,
    parentDir = '',
    src = 'src',
    dir = name ?? 'program',
    noEmit = type === 'script',
    ...rest
  }: Magicspace.BoilerplateOptions.TypeScriptProjectOptions,
  packageOptions: ResolvedPackageOptions,
): ResolvedTypeScriptProjectOptions {
  let packageDir = packageOptions?.dir ?? '';

  let srcDir = Path.posix.join(packageDir, parentDir, src || '', dir);
  let outDir = Path.posix.join(
    packageDir,
    parentDir,
    noEmit ? '.bld-cache' : 'bld',
    dir,
  );

  return {
    srcDir,
    outDir,
    tsconfigPath: Path.posix.join(srcDir, 'tsconfig.json'),
    type,
    dev,
    noEmit,
    package: packageOptions,
    ...rest,
  };
}
