import {ComposableModuleFunction, json} from '@magicspace/core';
import {fetchPackageVersions} from '@magicspace/utils';
import _ from 'lodash';

import {resolveTypeScriptProjectsWithEntrances} from './@utils';

const DEPENDENCY_DICT = {
  'entrance-decorator': '0.1',
};

const composable: ComposableModuleFunction = async options => {
  let projects = resolveTypeScriptProjectsWithEntrances(options);

  let packagesWithEntrancesEnabledProject = _.uniqBy(
    projects.map(project => project.package),
    packageOptions => packageOptions.packageJSONPath,
  );

  let dependencies = await fetchPackageVersions(DEPENDENCY_DICT);

  return packagesWithEntrancesEnabledProject.map(packageOptions =>
    json(packageOptions.packageJSONPath, (data: any) => {
      return {
        ...data,
        dependencies: {
          ...data.dependencies,
          ...dependencies,
        },
      };
    }),
  );
};

export default composable;
