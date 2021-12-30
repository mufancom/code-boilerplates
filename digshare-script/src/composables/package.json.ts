/// <reference path="../../boilerplate.d.ts" />

import {ComposableModuleFunction, json} from '@magicspace/core';
import {fetchPackageVersions, sortObjectKeys} from '@magicspace/utils';
import _ from 'lodash';

import {
  buildResolvedTypeScriptProjectOptions,
  resolveTypeScriptProjects,
} from '../../../typescript/bld/library';

const DEPENDENCY_DICT = {
  '@digshare/script': '^0.2.2',
  '@types/cheerio': '^0.22.30',
  '@types/node-fetch': '^2.5.12',
  cheerio: '^1.0.0-rc.10',
  'node-fetch': '2.6.5',
};

const DEV_DEPENDENCIES_DICT = {
  'ts-node': '^10.4.0',
};

const composable: ComposableModuleFunction = async options => {
  let dependencies = await fetchPackageVersions(DEPENDENCY_DICT);
  let devDependencies = await fetchPackageVersions(DEV_DEPENDENCIES_DICT);

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
            pub: 'node ./publish.js',
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
              build: `yarn ts-build && dss build -i bld/${tsProjectName}/index.js`,
              'ts-build': `rimraf ./bld && tsc --build src/${tsProjectName}/tsconfig.json`,
              'dev-run': `ts-node src/${tsProjectName}/@run.ts`,
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
            runtime: packageOptions.runtime || options.digshareScript.runtime,
          },
          files: ['out'],
        };
      }),
    ),
  ];
};

export default composable;
