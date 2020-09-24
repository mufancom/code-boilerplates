import {CustomDeclareDict, PowerAppVersion} from '@makeflow/power-app';

export function Version<TCustomDeclareDict extends Partial<CustomDeclareDict>>(
  definition: PowerAppVersion.Definition<TCustomDeclareDict>,
): PowerAppVersion.Definition<TCustomDeclareDict> {
  return definition;
}
