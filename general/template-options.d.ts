declare namespace Magicspace {
  interface TemplateOptions {
    name: string;
    repository?: string;
    license?: string;
    author?: string;
    packagesDir?: string;
    packages?: TemplateOptions.PackageOptions[];
    prettier?: TemplateOptions.PrettierOptions;
  }

  namespace TemplateOptions {
    interface PackageOptions {
      name: string;
      dir?: string;
    }

    interface PrettierOptions {
      printWidth?: number;
      tabWidth?: number;
      useTabs?: boolean;
      semi?: boolean;
      singleQuote?: boolean;
      quoteProps?: 'as-needed' | 'consistent' | 'preserve';
      jsxSingleQuote?: boolean;
      trailingComma?: 'es5' | 'none' | 'all';
      bracketSpacing?: boolean;
      jsxBracketSameLine?: boolean;
      arrowParens?: 'always' | 'avoid';
    }
  }
}
