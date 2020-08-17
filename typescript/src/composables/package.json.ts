import {ComposableModuleFunction, json} from '@magicspace/core';
import {
  extendObjectProperties,
  extendPackageScript,
  fetchPackageVersions,
  sortObjectKeys,
} from '@magicspace/utils';

import {resolveTypeScriptProjects} from '../library';

const DEV_DEPENDENCY_DICT = {
  '@mufan/code': '0.2',
  '@mufan/eslint-plugin': '0.1',
  rimraf: '3',
  typescript: '3',
};

const composable: ComposableModuleFunction = async options => {
  let {
    projects,
    package: {packagesDir},
  } = resolveTypeScriptProjects(options);

  let anyProjectsInRoot = projects.some(project => !project.package);
  let anyProjectsInPackage = projects.some(project => !!project.package);

  let rimrafArgs = [
    ...(anyProjectsInRoot ? ['bld', '.bld-cache'] : []),
    ...(anyProjectsInPackage ? [`'${packagesDir}/*/{bld,.bld-cache}'`] : []),
  ];

  let devDependencies = await fetchPackageVersions(DEV_DEPENDENCY_DICT);

  return [
    json('package.json', (data: any) => {
      let {scripts = {}} = data;

      scripts = extendObjectProperties(
        scripts,
        {
          build: extendPackageScript(scripts.build, [
            `rimraf ${rimrafArgs.join(' ')}`,
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
          test: extendPackageScript(scripts.test, 'yarn build'),
        },
        {
          after: '*lint-prettier*',
        },
      );

      return {
        ...data,
        scripts,
        devDependencies: sortObjectKeys({
          ...data.devDependencies,
          ...devDependencies,
        }),
      };
    }),
  ];
};

export default composable;
