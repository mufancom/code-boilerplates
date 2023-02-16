import * as Path from 'path';

import {composable, json} from '@magicspace/core';
import {
  extendObjectProperties,
  extendPackageScript,
  fetchPackageVersions,
} from '@magicspace/utils';
import * as _ from 'lodash';

import type {ResolvedPackageOptions} from '../../../general/bld/library';
import type {
  ResolvedOptions,
  ResolvedTypeScriptProjectOptions,
} from '../library';

const ROOT_DEV_DEPENDENCY_DICT = {
  '@mufan/code': '0.2',
  '@mufan/eslint-plugin': '0.1',
  rimraf: '3',
  typescript: '4',
  'run-in-every': '0.2',
};

const PROJECT_DEPENDENCY_DICT = {
  tslib: '2',
};

const PROJECT_ENTRANCES_DEPENDENCY_DICT = {
  'entrance-decorator': '0.2',
};

export default composable<ResolvedOptions>(
  async ({resolvedTSProjects: projects}) => {
    const anyProjectWithEntrances = projects.some(
      project => project.entrances.length > 0,
    );

    const packagesWithTypeScriptProject = _.uniqBy(
      projects.map(project => project.package),
      packageOptions => packageOptions.packageJSONPath,
    );

    const [
      rootDevDependencies,
      projectDependencies,
      projectEntrancesDependencies,
    ] = await Promise.all([
      fetchPackageVersions(ROOT_DEV_DEPENDENCY_DICT),
      fetchPackageVersions(PROJECT_DEPENDENCY_DICT),
      anyProjectWithEntrances
        ? fetchPackageVersions(PROJECT_ENTRANCES_DEPENDENCY_DICT)
        : undefined,
    ]);

    return [
      json('package.json', (data: any) => {
        let {scripts = {}} = data;

        let rimrafScript: string | undefined;

        {
          const rimrafPattern = guessReadableGlobPattern([
            projects.map(project => project.bldDir),
          ]);

          if (rimrafPattern) {
            rimrafScript = `rimraf ${rimrafPattern}`;
          }
        }

        scripts['lint'] =
          'run-in-every eslint-project --parallel --echo -- eslint --config {configFileName} --no-error-on-unmatched-pattern .';

        scripts = extendObjectProperties(
          scripts,
          {
            build: extendPackageScript(
              scripts.build,
              _.compact([rimrafScript, 'tsc --build']),
            ),
          },
          {
            before: '*lint*',
          },
        );

        scripts = extendObjectProperties(
          scripts,
          {
            test: extendPackageScript(scripts.test, 'yarn build', {
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
        json(packageOptions.packageJSONPath, (data: any) => {
          const referencedPackageNames = _.compact(
            _.union(
              ...(packageOptions.tsProjects?.map(projectOptions =>
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

          const libraryProjects = packageProjects
            .filter(project => project.type === 'library')
            .sort((a, b) => {
              return a.name === 'library'
                ? -Infinity
                : b.name === 'library'
                ? Infinity
                : a.name < b.name
                ? -1
                : 1;
            });

          const mainLibraryProject = libraryProjects.find(
            project => project.name === 'library',
          );

          const entrances =
            anyProjectWithEntrances &&
            packageProjects.some(project => project.entrances.length > 0);

          return {
            ...data,
            ...(mainLibraryProject && libraryProjects.length === 1
              ? {
                  exports: buildProjectExport(
                    packageOptions,
                    mainLibraryProject,
                  ),
                }
              : libraryProjects.length > 0
              ? {
                  exports: emptyObjectAsUndefined({
                    ...data.exports,
                    ...Object.fromEntries(
                      libraryProjects
                        .map(project => [
                          project.name === 'library'
                            ? '.'
                            : `./${project.name}`,
                          buildProjectExport(packageOptions, project),
                        ])
                        .filter(([, value]) => !!value),
                    ),
                  }),
                }
              : undefined),
            dependencies: {
              ...data.dependencies,
              ...projectDependencies,
              ...(entrances ? projectEntrancesDependencies : undefined),
              ..._.fromPairs(referencedPackageNames.map(name => [name, '*'])),
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
  {exportAs, exportSourceAs, inDir, outDir}: ResolvedTypeScriptProjectOptions,
): Record<string, string | Record<string, string>> | undefined {
  const exportSourceAsPart = exportSourceAs
    ? {
        [exportSourceAs]: `./${Path.posix.relative(
          resolvedDir,
          Path.posix.join(inDir, 'index.ts'),
        )}`,
      }
    : undefined;

  return emptyObjectAsUndefined({
    ...(exportAs
      ? {
          types: `./${Path.posix.relative(
            resolvedDir,
            Path.posix.join(outDir, 'index.d.ts'),
          )}`,
          ...exportSourceAsPart,
          [exportAs]: `./${Path.posix.relative(
            resolvedDir,
            Path.posix.join(outDir, 'index.js'),
          )}`,
        }
      : exportSourceAsPart),
  });
}

export function emptyObjectAsUndefined<T extends object>(
  object: T,
): T | undefined {
  return Object.entries(object).length > 0 ? object : undefined;
}
