import {ComposableModuleFunction, json} from '@magicspace/core';
import {
  extendObjectProperties,
  extendPackageScript,
  fetchPackageVersions,
  sortObjectKeys,
} from '@magicspace/utils';

const DEPENDENCY_DICT = {
  tslib: '2',
};

const DEV_DEPENDENCY_DICT = {
  '@mufan/code': '0.2',
  '@mufan/eslint-plugin': '0.1',
  rimraf: '3',
  typescript: '4',
};

const composable: ComposableModuleFunction = async () => {
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
            `rimraf '{,!(node_modules)/**/}{bld,.bld-cache}'`,
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
        dependencies: sortObjectKeys({
          ...data.dependencies,
          ...dependencies,
        }),
        devDependencies: sortObjectKeys({
          ...data.devDependencies,
          ...devDependencies,
        }),
      };
    }),
  ];
};

export default composable;
