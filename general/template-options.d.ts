declare namespace Magicspace {
  interface TemplateOptions {
    name: string;
    author?: string;
    license?: string;
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
