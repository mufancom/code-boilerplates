/// <reference path="../../boilerplate.d.ts" />

import {ComposableModuleFunction, json} from '@magicspace/core';
import {fetchPackageVersions, sortObjectKeys} from '@magicspace/utils';
import _ from 'lodash';

import {resolveTypeScriptProjects} from '../../../typescript/bld/library';

const DEPENDENCY_DICT = {
  'dss-sdk': '^0.1.1',
};

const DEV_DEPENDENCIES_DICT = {
  'cross-env': '^7.0.3',
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
            'lerna:publish': 'yarn build && lerna publish patch',
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
        return {
          ...data,
          description: packageOptions.displayName,
          main: 'out/index.js',
          types: undefined,
          scripts: sortObjectKeys(
            {
              ...data.scripts,
              prepublishOnly: 'yarn build',
              build: `yarn ts-build && cross-env DIGSHARE_API=${options.digshareScript.openAPI.host}/${options.digshareScript.openAPI.version} dss build -i bld/library/index.js`,
              'ts-build':
                'rimraf ./bld && tsc --build src/library/tsconfig.json',
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
          publishConfig: {
            registry: `${options.digshareScript.openAPI.host}/registry/`,
          },
          digshare: {
            runtime: packageOptions.runtime || options.digshareScript.runtime,
          },
          files: ['out'],
        };
      }),
    ),
  ];
};

export default composable;
