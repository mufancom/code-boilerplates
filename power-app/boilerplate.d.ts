/// <reference path="../typescript/boilerplate.d.ts" />

declare namespace Magicspace {
  interface BoilerplateOptions {
    powerApp: BoilerplateOptions.PowerAppOptions;
  }

  namespace BoilerplateOptions {
    interface PowerAppOptions {
      port: number;
      images?: string[];
      /**
       * 会根据 pages 生成 client 的页面模板
       */
      pages?: string[];
    }
  }
}
