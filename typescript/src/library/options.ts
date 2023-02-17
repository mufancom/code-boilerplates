import * as Path from 'path';

import {x} from '@magicspace/core';
import type {OmitValueOfKey} from 'tslang';

import type {
  ResolvedOptions as ResolvedGeneralOptions,
  ResolvedPackageOptions as ResolvedGeneralPackageOptions,
} from '../../../general/bld/library';
import {
  Options as GeneralOptions,
  PackageOptions as GeneralPackageOptions,
  resolveOptions as resolveGeneralOptions,
} from '../../../general/bld/library';

export const TypeScriptProjectReferenceOptions = x.object({
  /**
   * Package name to reference.
   */
  package: x.string,
  /**
   * Project name to reference.
   */
  project: x.string,
});

export type TypeScriptProjectReferenceOptions = x.TypeOf<
  typeof TypeScriptProjectReferenceOptions
>;

export const GeneralTypeScriptProjectReferenceOptions = x.union([
  x.string,
  TypeScriptProjectReferenceOptions,
]);

export type GeneralTypeScriptProjectReferenceOptions = x.TypeOf<
  typeof GeneralTypeScriptProjectReferenceOptions
>;

export const BuildModuleType = x.union([x.literal('cjs'), x.literal('esm')]);

export type BuildModuleType = x.TypeOf<typeof BuildModuleType>;

export const TypeScriptProjectOptions = x.object({
  /**
   * TypeScript project name, defaults to 'program'.
   */
  name: x.string.optional(),
  /**
   * Is this TypeScript project a library or program? Defaults to 'library'
   * if project name is 'library', otherwise 'program'.
   */
  type: x
    .union([x.literal('library'), x.literal('program'), x.literal('script')])
    .optional(),
  /**
   * Module type to build, defaults to 'cjs'.
   */
  module: x.union([BuildModuleType, x.array(BuildModuleType)]).optional(),
  /**
   * Whether to export.
   */
  exports: x.boolean.optional(),
  /**
   * Export source with specific condition name, e.g.: "vite".
   */
  exportSourceAs: x.string.optional(),
  /**
   * Is this TypeScript project a development-time project? Defaults to
   * true if the project name is 'test', otherwise false.
   */
  dev: x.boolean.optional(),
  /**
   * Parent directory, defaults to false (package directory).
   */
  parentDir: x.union([x.string, x.literal(false)]).optional(),
  /**
   * Source directory, defaults to false if the project type is 'script',
   * otherwise 'src'.
   */
  src: x.union([x.string, x.literal(false)]).optional(),
  /**
   * TypeScript project directory under source directory, defaults to
   * `name` option.
   */
  dir: x.union([x.string, x.literal(false)]).optional(),
  /**
   * Whether this project does not emit build artifact, defaults to true if
   * `src` is false, otherwise false.
   */
  noEmit: x.boolean.optional(),
  /**
   * Add entrances file(s) and related package/configuration. If true, it
   * will use the default `['@entrances.ts']`.
   */
  entrances: x.union([x.array(x.string), x.boolean]).optional(),
  /**
   * References to other TypeScript projects, will be convert to
   * `references` field in 'tsconfig.json'.
   */
  references: x.array(GeneralTypeScriptProjectReferenceOptions).optional(),
});

export type TypeScriptProjectOptions = x.TypeOf<
  typeof TypeScriptProjectOptions
>;

export const PackageOptions = GeneralPackageOptions.extend({
  projects: x.array(TypeScriptProjectOptions).optional(),
});

export type PackageOptions = x.TypeOf<typeof PackageOptions>;

export const Options = GeneralOptions.extend({
  projects: x.array(TypeScriptProjectOptions).optional(),
  packages: x.array(PackageOptions).optional(),
});

export type Options = x.TypeOf<typeof Options>;

export interface ResolvedTypeScriptBuild {
  outDir: string;
  module: BuildModuleType;
}

export interface ResolvedTypeScriptProjectOptions {
  name: string;
  srcDir: string;
  bldDir: string;
  inDir: string;
  upperOutDir: string;
  type: 'library' | 'program' | 'script';
  builds: ResolvedTypeScriptBuild[];
  exports: boolean;
  exportSourceAs: string | undefined;
  dev: boolean;
  noEmit: boolean;
  entrances: string[];
  package: ResolvedPackageOptions;
  references: ResolvedTypeScriptProjectReference[] | undefined;
}

export type ResolvedPackageOptions = ResolvedGeneralPackageOptions &
  PackageOptions;

export interface ResolvedTypeScriptProjectReference {
  path: string;
}

export type ResolvedOptions = Options &
  ResolvedGeneralOptions & {
    resolvedProjects: ResolvedTypeScriptProjectOptions[];
  };

export function resolveOptions(options: Options): ResolvedOptions {
  const resolvedOptions = resolveGeneralOptions(options);

  const projectOptionsArray = resolvedOptions.packages.flatMap(
    (packageOptions: ResolvedPackageOptions) =>
      packageOptions.projects?.map(project =>
        buildResolvedTypeScriptProjectOptions(project, packageOptions),
      ) ?? [],
  );

  return {
    ...resolvedOptions,
    resolvedProjects: projectOptionsArray.map(
      ({references, ...projectOptions}) => {
        return {
          ...projectOptions,
          references: references?.map(rawReference => {
            let referencedPackageName: string;
            let referencedProjectName: string;

            if (typeof rawReference === 'string') {
              referencedPackageName = projectOptions.package.name;
              referencedProjectName = rawReference;
            } else {
              referencedPackageName = rawReference.package;
              referencedProjectName = rawReference.project;
            }

            const referencedProjectOptions = projectOptionsArray.find(
              projectOptions =>
                projectOptions.package.name === referencedPackageName &&
                projectOptions.name === referencedProjectName,
            );

            if (!referencedProjectOptions) {
              throw new Error(
                `Unknown TypeScript project name ${JSON.stringify(
                  referencedProjectName,
                )} under package ${JSON.stringify(referencedPackageName)}`,
              );
            }

            return {
              path: Path.posix.relative(
                projectOptions.inDir,
                referencedProjectOptions.inDir,
              ),
            };
          }),
        };
      },
    ),
  };
}

interface ResolvedTypeScriptProjectOptionsWithRawReferences
  extends OmitValueOfKey<ResolvedTypeScriptProjectOptions, 'references'> {
  references?: GeneralTypeScriptProjectReferenceOptions[];
}

export function buildResolvedTypeScriptProjectOptions(
  {
    name = 'program',
    type = name.includes('library') ? 'library' : 'program',
    module = 'cjs',
    exports = true,
    exportSourceAs,
    dev = name.includes('test') || type === 'script' ? true : false,
    parentDir = false,
    src = type === 'script' ? false : 'src',
    dir = name,
    noEmit = src === false ? true : false,
    entrances = false,
    ...rest
  }: TypeScriptProjectOptions,
  packageOptions: ResolvedPackageOptions,
): ResolvedTypeScriptProjectOptionsWithRawReferences {
  if (parentDir === false) {
    parentDir = '';
  }

  if (src === false) {
    src = '';
  }

  if (dir === false) {
    dir = '';
  }

  const modules = Array.isArray(module) ? module : [module];

  const packageDir = packageOptions.resolvedDir;

  const srcDir = Path.posix.join(packageDir, parentDir, src);
  const inDir = Path.posix.join(srcDir, dir);
  const bldDir = Path.posix.join(packageDir, parentDir, 'bld');

  const outFolderName = dir || name;
  const upperOutDir = Path.posix.join(bldDir, outFolderName);

  const builds: ResolvedTypeScriptBuild[] = [];

  if (modules.length > 1) {
    builds.push(
      ...modules.map(module => ({
        module,
        outDir: Path.posix.join(upperOutDir, module),
      })),
    );
  } else if (modules.length > 0) {
    builds.push({
      module: modules[0],
      outDir: upperOutDir,
    });
  } else {
    throw new Error('At least one of `cjs` and `esm` must be true');
  }

  return {
    name,
    srcDir,
    upperOutDir,
    bldDir,
    inDir,
    type,
    exports,
    exportSourceAs,
    dev,
    noEmit,
    entrances:
      typeof entrances === 'boolean'
        ? entrances
          ? ['@entrances.ts']
          : []
        : entrances,
    package: packageOptions,
    builds,
    ...rest,
  };
}
