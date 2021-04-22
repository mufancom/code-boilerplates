import * as Path from 'path';

import {ComposableModuleFunction, json} from '@magicspace/core';
import {
  extendObjectProperties,
  extendPackageScript,
  fetchPackageVersions,
} from '@magicspace/utils';
import _ from 'lodash';

import {resolveTypeScriptProjects} from '../library';

const ROOT_DEV_DEPENDENCY_DICT = {
  '@mufan/code': '0.2',
  '@mufan/eslint-plugin': '0.1',
  rimraf: '3',
  typescript: '4',
};

const PROJECT_DEPENDENCY_DICT = {
  tslib: '2',
};

const PROJECT_ENTRANCES_DEPENDENCY_DICT = {
  'entrance-decorator': '0.1',
};

const composable: ComposableModuleFunction = async options => {
  let {projects} = resolveTypeScriptProjects(options);

  let anyProjectWithEntrances = projects.some(
    project => project.entrances.length > 0,
  );

  let packagesWithTypeScriptProject = _.uniqBy(
    projects.map(project => project.package),
    packageOptions => packageOptions.packageJSONPath,
  );

  let [
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
        let rimrafPattern = guessReadableGlobPattern(
          projects.map(project => project.bldDir),
        );

        if (rimrafPattern) {
          rimrafScript = `rimraf ${
            /\s/.test(rimrafPattern) ? `'${rimrafPattern}'` : rimrafPattern
          }`;
        }
      }

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
        let referencedPackageNames = _.compact(
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

        let packageProjects = projects.filter(
          project =>
            project.package.packageJSONPath === packageOptions.packageJSONPath,
        );

        let [firstProject] = packageProjects;
        let firstLibraryProject =
          firstProject.type === 'library' ? firstProject : undefined;

        let entrances =
          anyProjectWithEntrances &&
          packageProjects.some(project => project.entrances.length > 0);

        return {
          ...data,
          ...(firstLibraryProject
            ? {
                [firstLibraryProject.esModule
                  ? 'module'
                  : 'main']: firstLibraryProject.noEmit
                  ? undefined
                  : `${Path.posix.relative(
                      packageOptions.dir,
                      Path.posix.join(firstLibraryProject.outDir, 'index.js'),
                    )}`,
                types: `${Path.posix.relative(
                  packageOptions.dir,
                  Path.posix.join(firstLibraryProject.outDir, 'index.d.ts'),
                )}`,
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
};

export default composable;

function guessReadableGlobPattern(paths: string[]): string | undefined {
  if (paths.length === 0) {
    return undefined;
  }

  let parentDirAndBaseNameArray = paths.map(path => {
    return {parentDir: Path.dirname(path), baseName: Path.basename(path)};
  });

  let parentDirs = _.uniq(
    parentDirAndBaseNameArray.map(info => info.parentDir),
  );

  let upperParentDirs = _.uniq(
    parentDirs.map(parentDir => Path.dirname(parentDir)),
  );

  if (upperParentDirs.length > 1) {
    // Guess only patterns with at most single '*' at the end.
    return undefined;
  }

  let parentPattern =
    parentDirs.length > 1 ? `${upperParentDirs[0]}/*` : parentDirs[0];

  let baseNames = _.uniq(parentDirAndBaseNameArray.map(info => info.baseName));

  let baseNamePattern =
    baseNames.length > 1 ? `{${baseNames.sort().join(',')}}` : baseNames[0];

  return `${parentPattern.replace(/^\.\//, '')}/${baseNamePattern}`;
}
