// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../template-options.d.ts" />

import * as Path from 'path';

import {
  ResolvedOptions,
  ResolvedPackageOptions,
  resolveOptions,
} from '../../../general/bld/library';

export interface ResolvedTypeScriptProjectOptions {
  srcDir: string;
  outDir: string;
  tsconfigPath: string;
  type: 'library' | 'program' | 'script';
  dev: boolean;
  package?: ResolvedPackageOptions;
}

export interface ResolveTypeScriptProjectsResult {
  projects: ResolvedTypeScriptProjectOptions[];
  package: ResolvedOptions;
}

export function resolveTypeScriptProjects(
  options: Magicspace.TemplateOptions,
): ResolveTypeScriptProjectsResult {
  let packageOptions = resolveOptions(options);
  let {tsProjects, packages} = packageOptions;

  return {
    projects: [
      ...(tsProjects?.map(project =>
        buildResolvedTypeScriptProjectOptions(project),
      ) ?? []),
      ...packages.flatMap(
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
  {name, type, dev}: Magicspace.TemplateOptions.TypeScriptProjectOptions,
  packageOptions?: ResolvedPackageOptions,
): ResolvedTypeScriptProjectOptions {
  let packageDir = packageOptions?.dir ?? '';

  let srcDir = Path.posix.join(packageDir, 'src', name);
  let outDir = Path.posix.join(
    packageDir,
    type === 'script' ? '.bld-cache' : 'bld',
    name,
  );

  return {
    srcDir,
    outDir,
    tsconfigPath: Path.posix.join(srcDir, 'tsconfig.json'),
    type: type ?? (name === 'library' ? 'library' : 'program'),
    dev: dev ?? name === 'test' ? true : false,
    package: packageOptions,
  };
}
