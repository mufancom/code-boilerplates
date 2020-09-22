/// <reference path="../typescript/boilerplate.d.ts" />

declare namespace Magicspace {
  interface BoilerplateOptions {
    powerApp: BoilerplateOptions.PowerAppOptions;
  }

  namespace BoilerplateOptions {
    interface PowerAppOptions {
      port: number;
    }
  }
}
