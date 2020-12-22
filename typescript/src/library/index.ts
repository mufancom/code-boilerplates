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
  name: string | undefined;
  srcDir: string;
  bldDir: string;
  outDir: string;
  tsconfigPath: string;
  type: 'library' | 'program' | 'script';
  dev: boolean;
  noEmit: boolean;
  package: ResolvedPackageOptions;
  references: ResolvedTypeScriptProjectReference[] | undefined;
}

export interface ResolvedTypeScriptProjectReference {
  path: string;
}

export interface ResolveTypeScriptProjectsResult {
  projects: ResolvedTypeScriptProjectOptions[];
  options: ResolvedOptions;
  /** @deprecated Use `options` property instead. */
  package: ResolvedOptions;
}

export function resolveTypeScriptProjects(
  options: Magicspace.BoilerplateOptions,
): ResolveTypeScriptProjectsResult {
  let resolvedOptions = resolveOptions(options);

  let projectOptionsArray = resolvedOptions.packages.flatMap(
    packageOptions =>
      packageOptions.tsProjects?.map(project =>
        buildResolvedTypeScriptProjectOptions(project, packageOptions),
      ) ?? [],
  );

  return {
    projects: projectOptionsArray.map(({references, ...projectOptions}) => {
      return {
        ...projectOptions,
        references: references?.map(rawReference => {
          let referencedPackageOptions: ResolvedPackageOptions | undefined;
          let referencedProjectName: string;

          if (typeof rawReference === 'string') {
            referencedPackageOptions = projectOptions.package;
            referencedProjectName = rawReference;
          } else {
            referencedPackageOptions = resolvedOptions.packages.find(
              packageOptions => packageOptions.name === rawReference.package,
            );
            referencedProjectName = rawReference.project;

            if (!referencedPackageOptions) {
              throw new Error(
                `Unknown package name ${JSON.stringify(rawReference.package)}`,
              );
            }
          }

          let referencedProjectOptions = projectOptionsArray.find(
            projectOptions => projectOptions.name === referencedProjectName,
          );

          if (!referencedProjectOptions) {
            throw new Error(
              `Unknown TypeScript project name ${JSON.stringify(
                referencedProjectName,
              )} under package ${JSON.stringify(
                referencedPackageOptions.name,
              )}`,
            );
          }

          return {
            path: Path.posix.relative(
              projectOptions.srcDir,
              referencedProjectOptions.srcDir,
            ),
          };
        }),
      };
    }),
    options: resolvedOptions,
    package: resolvedOptions,
  };
}

interface ResolvedTypeScriptProjectOptionsWithRawReferences
  extends OmitValueOfKey<ResolvedTypeScriptProjectOptions, 'references'> {
  references?: Magicspace.BoilerplateOptions.GeneralTypeScriptProjectReferenceOptions[];
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
): ResolvedTypeScriptProjectOptionsWithRawReferences {
  let packageDir = packageOptions?.dir ?? '';

  let srcDir = Path.posix.join(packageDir, parentDir, src || '', dir);
  let bldDir = Path.posix.join(
    packageDir,
    parentDir,
    noEmit ? '.bld-cache' : 'bld',
  );
  let outDir = Path.posix.join(bldDir, dir);

  return {
    name,
    srcDir,
    bldDir,
    outDir,
    tsconfigPath: Path.posix.join(srcDir, 'tsconfig.json'),
    type,
    dev,
    noEmit,
    package: packageOptions,
    ...rest,
  };
}
