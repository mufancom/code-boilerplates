/// <reference path="../../boilerplate.d.ts" />

import {ComposableModuleFunction, json} from '@magicspace/core';
import {fetchPackageVersions, sortObjectKeys} from '@magicspace/utils';
import _ from 'lodash';

import {
  buildResolvedTypeScriptProjectOptions,
  resolveTypeScriptProjects,
} from '../../../typescript/bld/library';

const DEPENDENCY_DICT = {
  '@types/cheerio': '^0.22.30',
  '@types/node-fetch': '^2.5.12',
  cheerio: '^1.0.0-rc.10',
  'dss-sdk': '^0.2.0',
  'node-fetch': '2.6.5',
};

const DEV_DEPENDENCIES_DICT = {
  'cross-env': '^7.0.0',
  'ts-node': '^10.4.0',
};

const ROOT_DEPENDENCY_DICT = {};

const ROOT_DEV_DEPENDENCIES_DICT = {
  lerna: '^4.0.0',
  'run-in-every': '^0.2.0',
};

const composable: ComposableModuleFunction = async options => {
  let dependencies = await fetchPackageVersions(DEPENDENCY_DICT);
  let devDependencies = await fetchPackageVersions(DEV_DEPENDENCIES_DICT);

  let rootDependencies = await fetchPackageVersions(ROOT_DEPENDENCY_DICT);
  let rootDevDependencies = await fetchPackageVersions(
    ROOT_DEV_DEPENDENCIES_DICT,
  );

  let {projects} = resolveTypeScriptProjects(options);

  let packagesWithTypeScriptProject = _.uniqBy(
    projects.map(project => project.package),
    packageOptions => packageOptions.packageJSONPath,
  );

  return [
    json('package.json', (data: any) => {
      return {
        ...data,
        scripts: sortObjectKeys(
          {
            ...data.scripts,
            'lerna:publish': 'lerna publish patch',
            build:
              'run-in-every directory-with-file --pattern "packages/*/package.json" --data "scripts.build" --echo --parallel -- yarn build',
          },
          'asc',
        ),
        dependencies: sortObjectKeys(
          {
            ...data.dependencies,
            ...rootDependencies,
          },
          'asc',
        ),
        devDependencies: sortObjectKeys(
          {
            ...data.devDependencies,
            ...rootDevDependencies,
          },
          'asc',
        ),
      };
    }),
    ...packagesWithTypeScriptProject.map(packageOptions =>
      json(packageOptions.packageJSONPath, (data: any) => {
        let tsProjectName = buildResolvedTypeScriptProjectOptions(
          packageOptions.tsProjects?.[0]!,
          packageOptions,
        ).name!;

        return {
          ...data,
          description: packageOptions.displayName,
          main: 'out/index.js',
          types: undefined,
          scripts: sortObjectKeys(
            {
              ...data.scripts,
              prepublishOnly: 'yarn build',
              build: `yarn ts-build && cross-env DIGSHARE_API=${options.digshareScript.openAPI.host}/${options.digshareScript.openAPI.version} dss build -i bld/${tsProjectName}/index.js`,
              'ts-build': `rimraf ./bld && tsc --build src/${tsProjectName}/tsconfig.json`,
              'dev-run': `cross-env DIGSHARE_ENV=development ts-node src/${tsProjectName}/index.ts`,
            },
            'asc',
          ),
          dependencies: sortObjectKeys(
            {
              ...data.dependencies,
              ...dependencies,
            },
            'asc',
          ),
          devDependencies: sortObjectKeys(
            {
              ...data.devDependencies,
              ...devDependencies,
            },
            'asc',
          ),
          digshare: {
            registry: packageOptions.registry,
            runtime: packageOptions.runtime || options.digshareScript.runtime,
          },
          files: ['out'],
        };
      }),
    ),
  ];
};

export default composable;
