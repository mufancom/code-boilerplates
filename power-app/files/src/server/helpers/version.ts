import {
  CustomDeclareDict,
  PowerApp,
  PowerAppVersion,
} from '@makeflow/power-app';

export function initializePowerAppVersion(
  powerApp: PowerApp,
  versions: {[T in string]: {[TK in string]: PowerAppVersion.Definition<any>}},
): void {
  for (const [version, definition] of Object.values(versions).flatMap(
    Object.entries,
  )) {
    powerApp.version(version, definition);
  }
}

export function Version<TCustomDeclareDict extends Partial<CustomDeclareDict>>(
  definition: PowerAppVersion.Definition<TCustomDeclareDict>,
): PowerAppVersion.Definition<TCustomDeclareDict> {
  return definition;
}
