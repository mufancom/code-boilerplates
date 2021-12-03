/// <reference path="../typescript/boilerplate.d.ts" />

declare namespace Magicspace {
  interface BoilerplateOptions {
    digshareScript: BoilerplateOptions.DigshareScriptOptions;
  }

  namespace BoilerplateOptions {
    interface DigshareScriptOptions {
      openAPI: {
        host: string;
        version: string;
      };
      runtime: string;
    }

    interface PackageOptions {
      registry: string;
      displayName?: string;
      runtime?: string;
    }
  }
}
