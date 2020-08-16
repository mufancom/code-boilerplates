declare namespace Magicspace {
  interface TemplateOptions {
    name: string;
    repository?: string;
    license?: string;
    author?: string;
    packagesDir?: string;
    packages?: TemplateOptions.PackageOptions[];
  }

  namespace TemplateOptions {
    interface PackageOptions {
      name: string;
      dir?: string;
    }
  }
}
