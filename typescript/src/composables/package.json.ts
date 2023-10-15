import * as Path from 'path';

import {composable, json} from '@magicspace/core';
import {
  extendObjectProperties,
  extendPackageScript,
  fetchPackageVersions,
} from '@magicspace/utils';
import _ from 'lodash';

import type {
  ResolvedPackageOptions,
  PackageExports,
  ResolvedOptions,
  ResolvedTypeScriptProjectOptions,
} from '../library/index.js';

const ROOT_DEV_DEPENDENCY_DICT = {
  rimraf: '5',
  typescript: '5',
  'run-in-every': '0.2',
};

const PROJECT_DEPENDENCY_DICT = {
  tslib: '2',
};

function PROJECT_ENTRANCES_DEPENDENCY_DICT(
  esm: boolean,
): Record<string, string> {
  return {
    'entrance-decorator': esm ? '0.3' : '0.2',
  };
}

const WORKSPACE_REFERENCE_DICT = {
  pnpm: 'workspace:*',
  yarn: '*',
};

export default composable<ResolvedOptions>(
  async ({packageManager, resolvedProjects: projects}) => {
    const projectWithEntrances = projects.filter(
      project => project.entrances.length > 0,
    );

    const anyESMProjectWithEntrances = projectWithEntrances.some(
      project => project.package.type === 'module',
    );

    const anyCJSProjectWithEntrances = projectWithEntrances.some(
      project => project.package.type !== 'module',
    );

    const packagesWithTypeScriptProject = _.uniqBy(
      projects.map(project => project.package),
      packageOptions => packageOptions.packageJSONPath,
    );

    const [
      rootDevDependencies,
      projectDependencies,
      esmProjectEntrancesDependencies,
      cjsProjectEntrancesDependencies,
    ] = await Promise.all([
      fetchPackageVersions(ROOT_DEV_DEPENDENCY_DICT),
      fetchPackageVersions(PROJECT_DEPENDENCY_DICT),
      anyESMProjectWithEntrances
        ? fetchPackageVersions(PROJECT_ENTRANCES_DEPENDENCY_DICT(true))
        : undefined,
      anyCJSProjectWithEntrances
        ? fetchPackageVersions(PROJECT_ENTRANCES_DEPENDENCY_DICT(false))
        : undefined,
    ]);

    return [
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      json('package.json', (data: any) => {
        let {scripts = {}} = data;

        let rimrafScript: string | undefined;

        {
          const rimrafPattern = guessReadableGlobPattern([
            projects.map(project => project.bldDir),
          ]);

          if (rimrafPattern) {
            rimrafScript = `rimraf ${
              /[*{]/.test(rimrafPattern) ? '--glob ' : ''
            }${rimrafPattern}`;
          }
        }

        scripts = extendObjectProperties(
          scripts,
          {
            build: extendPackageScript(
              scripts.build,
              _.compact([rimrafScript, 'tsc --build']),
            ),
            lint: extendPackageScript(
              scripts.lint,
              'run-in-every eslint-project --parallel --echo -- eslint --no-error-on-unmatched-pattern .',
            ),
          },
          {
            before: '*lint*',
          },
        );

        scripts = extendObjectProperties(
          scripts,
          {
            test: extendPackageScript(scripts.test, `${packageManager} build`, {
              after: '*lint-prettier*',
            }),
          },
          {
            after: '*lint*',
          },
        );

        return {
          ...data,
          scripts,
          devDependencies: {
            ...data.devDependencies,
            ...rootDevDependencies,
          },
        };
      }),
      ...packagesWithTypeScriptProject.map(packageOptions =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        json(packageOptions.packageJSONPath, (data: any) => {
          const referencedPackageNames = _.compact(
            _.union(
              ...(packageOptions.projects?.map(
                projectOptions =>
                  projectOptions.references?.map(reference =>
                    typeof reference === 'string'
                      ? undefined
                      : reference.package !== packageOptions.name
                      ? reference.package
                      : undefined,
                  ),
              ) ?? []),
            ),
          );

          const packageProjects = projects.filter(
            project =>
              project.package.packageJSONPath ===
              packageOptions.packageJSONPath,
          );

          const projectAndExportsArray = _.compact(
            packageProjects.map(
              (
                project,
              ):
                | [ResolvedTypeScriptProjectOptions, PackageExports]
                | undefined =>
                project.exports ? [project, project.exports] : undefined,
            ),
          );

          const singleProjectAndExports =
            projectAndExportsArray.length === 1
              ? projectAndExportsArray[0]
              : undefined;
          const singleMainProjectAndExports =
            singleProjectAndExports &&
            singleProjectAndExports[1].subpath === '.'
              ? singleProjectAndExports
              : undefined;

          const entrances = packageProjects.some(
            project => project.entrances.length > 0,
          );

          const workspaceReference = WORKSPACE_REFERENCE_DICT[packageManager];

          return {
            ...data,
            ...(singleMainProjectAndExports
              ? {
                  exports: buildProjectExport(
                    packageOptions,
                    singleMainProjectAndExports[0],
                    singleMainProjectAndExports[1],
                  ),
                }
              : projectAndExportsArray.length > 0
              ? {
                  exports: emptyObjectAsUndefined({
                    ...data.exports,
                    ...Object.fromEntries(
                      projectAndExportsArray
                        .map(([project, exports]) => [
                          exports.subpath,
                          buildProjectExport(packageOptions, project, exports),
                        ])
                        .filter(([, value]) => !!value),
                    ),
                  }),
                }
              : undefined),
            dependencies: {
              ...data.dependencies,
              ...projectDependencies,
              ...(entrances
                ? packageOptions.type === 'module'
                  ? esmProjectEntrancesDependencies
                  : cjsProjectEntrancesDependencies
                : undefined),
              ..._.fromPairs(
                referencedPackageNames.map(name => [name, workspaceReference]),
              ),
            },
          };
        }),
      ),
    ];
  },
);

function guessReadableGlobPattern(pathGroups: string[][]): string | undefined {
  return pathGroups
    .map(paths => guess(paths))
    .filter(
      (pattern): pattern is typeof pattern & string =>
        typeof pattern === 'string',
    )
    .map(pattern => (/\s/.test(pattern) ? `'${pattern}'` : pattern))
    .join(' ');

  function guess(paths: string[]): string | undefined {
    if (paths.length === 0) {
      return undefined;
    }

    const parentDirAndBaseNameArray = paths.map(path => {
      return {parentDir: Path.dirname(path), baseName: Path.basename(path)};
    });

    const parentDirs = _.uniq(
      parentDirAndBaseNameArray.map(info => info.parentDir),
    );

    const upperParentDirs = _.uniq(
      parentDirs.map(parentDir => Path.dirname(parentDir)),
    );

    if (upperParentDirs.length > 1) {
      // Guess only patterns with at most single '*' at the end.
      return undefined;
    }

    const parentPattern =
      parentDirs.length > 1 ? `${upperParentDirs[0]}/*` : parentDirs[0];

    const baseNames = _.uniq(
      parentDirAndBaseNameArray.map(info => info.baseName),
    );

    const baseNamePattern =
      baseNames.length > 1 ? `{${baseNames.sort().join(',')}}` : baseNames[0];

    return `${parentPattern.replace(/^\.\//, '')}/${baseNamePattern}`;
  }
}

function buildProjectExport(
  {resolvedDir}: ResolvedPackageOptions,
  {exportSourceAs, inDir, outDir, noEmit}: ResolvedTypeScriptProjectOptions,
  {module: exportsModule}: PackageExports,
): Record<string, string | Record<string, string>> | undefined {
  const exportSourceAsPart = exportSourceAs
    ? {
        [exportSourceAs]: `./${Path.posix.relative(
          resolvedDir,
          Path.posix.join(inDir, `${exportsModule}.ts`),
        )}`,
      }
    : undefined;

  if (noEmit) {
    return exportSourceAsPart;
  }

  return {
    types: `./${Path.posix.relative(
      resolvedDir,
      Path.posix.join(outDir, `${exportsModule}.d.ts`),
    )}`,
    ...exportSourceAsPart,
    default: `./${Path.posix.relative(
      resolvedDir,
      Path.posix.join(outDir, `${exportsModule}.js`),
    )}`,
  };
}

export function emptyObjectAsUndefined<T extends object>(
  object: T,
): T | undefined {
  return Object.entries(object).length > 0 ? object : undefined;
}
