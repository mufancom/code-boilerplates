import {ComposableModuleFunction, json} from '@magicspace/core';
import {fetchPackageVersions} from '@magicspace/utils';
import _ from 'lodash';

import {resolveTypeScriptProjects} from '../../../typescript/bld/library';

const DEPENDENCY_DICT = {
  'entrance-decorator': '0.1',
};

const composable: ComposableModuleFunction = async options => {
  let {projects} = resolveTypeScriptProjects(options);

  let packagesWithTypeScriptProject = _.uniqBy(
    projects.map(project => project.package),
    packageOptions => packageOptions.packageJSONPath,
  );

  let dependencies = await fetchPackageVersions(DEPENDENCY_DICT);

  return packagesWithTypeScriptProject.map(packageOptions =>
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
