const Path = require('path');

function resolveProjectOptions({
  packagesDir = 'packages',
  packages = [],
  ...rest
}) {
  return {
    ...rest,
    packagesDir,
    packages: packages.map(package => {
      return {
        ...package,
        dir: Path.join(
          packagesDir,
          package.dir || package.name.replace(/^@[^/]+/, ''),
        ),
      };
    }),
  };
}

module.exports = {resolveProjectOptions};
