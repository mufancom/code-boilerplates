/// <reference path="../typescript/boilerplate.d.ts" />

declare namespace Magicspace {
  interface BoilerplateOptions {
    digshareScript: BoilerplateOptions.DigshareScriptOptions;
  }

  namespace BoilerplateOptions {
    interface DigshareScriptOptions {
      runtime: string;
    }

    interface PackageOptions {
      displayName?: string;
      runtime?: string;
    }
  }
}
