import _ from 'lodash';

import {
  ResolvedTypeScriptProjectOptions,
  resolveTypeScriptProjects,
} from '../../../typescript/bld/library';

export interface ResolvedTypeScriptProjectOptionsWithEntrances
  extends ResolvedTypeScriptProjectOptions {
  entrances: string[];
}

export function resolveTypeScriptProjectsWithEntrances(
  options: Magicspace.BoilerplateOptions,
): ResolvedTypeScriptProjectOptionsWithEntrances[] {
  let {projects} = resolveTypeScriptProjects(options);

  return _.compact(
    projects.map(({entrances = false, ...rest}) => {
      if (!entrances) {
        return undefined;
      }

      if (entrances === true) {
        entrances = ['@entrances'];
      }

      return {
        entrances,
        ...rest,
      };
    }),
  );
}
