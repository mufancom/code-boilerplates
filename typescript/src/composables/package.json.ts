import {ComposableModuleFunction, json} from '@magicspace/core';
import {
  extendObjectProperties,
  extendPackageScript,
  fetchPackageVersions,
} from '@magicspace/utils';
import _ from 'lodash';

import {resolveTypeScriptProjects} from '../library';

const DEPENDENCY_DICT = {
  tslib: '2',
};

const DEV_DEPENDENCY_DICT = {
  '@mufan/code': '0.2',
  '@mufan/eslint-plugin': '0.1',
  rimraf: '3',
  typescript: '4',
};

const composable: ComposableModuleFunction = async options => {
  let {
    package: {packagesDir},
    projects,
  } = resolveTypeScriptProjects(options);

  let packagesWithTypeScriptProject = _.uniqBy(
    projects.map(project => project.package),
    packageOptions => packageOptions.packageJSONPath,
  );

  let [dependencies, devDependencies] = await Promise.all([
    fetchPackageVersions(DEPENDENCY_DICT),
    fetchPackageVersions(DEV_DEPENDENCY_DICT),
  ]);

  return [
    json('package.json', (data: any) => {
      let {scripts = {}} = data;

      scripts = extendObjectProperties(
        scripts,
        {
          build: extendPackageScript(scripts.build, [
            `rimraf '${
              packagesDir === undefined ? '' : `${packagesDir}/*/`
            }{bld,.bld-cache}'`,
            'tsc --build',
          ]),
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
          ...devDependencies,
        },
      };
    }),
    ...packagesWithTypeScriptProject.map(packageOptions =>
      json(packageOptions.packageJSONPath, (data: any) => {
        return {
          ...data,
          dependencies: {
            ...data.dependencies,
            ...dependencies,
          },
        };
      }),
    ),
  ];
};

export default composable;
