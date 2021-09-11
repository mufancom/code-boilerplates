/// <reference path="../general/boilerplate.d.ts" />

declare namespace Magicspace {
  interface BoilerplateOptions {
    tsProjects?: BoilerplateOptions.TypeScriptProjectOptions[];
  }

  namespace BoilerplateOptions {
    interface PackageOptions {
      tsProjects?: TypeScriptProjectOptions[];
    }

    interface TypeScriptProjectOptions extends TypeScriptProjectBaseOptions {}

    interface TypeScriptProjectBaseOptions {
      /**
       * TypeScript project name, defaults to 'program'.
       */
      name?: string;
      /**
       * Is this TypeScript project a library or program? Defaults to 'library'
       * if project name is 'library', otherwise 'program'.
       *
       * If the type is specified as 'script', the project will output to
       * '.bld-cache' instead of 'bld'.
       */
      type?: 'library' | 'program' | 'script';
      /**
       * Whether to compile as ES module.
       */
      esModule?: boolean;
      /**
       * Is this TypeScript project a development-time project? Defaults to
       * true if the project name is 'test', otherwise false.
       */
      dev?: boolean;
      /**
       * Parent directory, defaults to false (package directory).
       */
      parentDir?: string | false;
      /**
       * Source directory, defaults to false if the project type is 'script',
       * otherwise 'src'.
       */
      src?: string | false;
      /**
       * TypeScript project directory under source directory, defaults to
       * `name` option.
       */
      dir?: string | false;
      /**
       * Whether this project does not emit build artifact, defaults to true if
       * `src` is false, otherwise false. If true, it will set `outDir` as
       * '.bld-cache' instead of 'bld'.
       */
      noEmit?: boolean;
      /**
       * Add entrances file(s) and related package/configuration. If true, it
       * will use the default `['@entrances.ts']`.
       */
      entrances?: string[] | boolean;
      /**
       * References to other TypeScript projects, will be convert to
       * `references` field in 'tsconfig.json'.
       */
      references?: GeneralTypeScriptProjectReferenceOptions[];
    }

    /**
     * String as the shorthand of project reference under the same package.
     */
    type GeneralTypeScriptProjectReferenceOptions =
      | string
      | TypeScriptProjectReferenceOptions;

    interface TypeScriptProjectReferenceOptions {
      /**
       * Package name to reference.
       */
      package: string;
      /**
       * Project name to reference.
       */
      project: string;
    }
  }
}
