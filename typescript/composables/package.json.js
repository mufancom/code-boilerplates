const {json} = require('@magicspace/core');
const latestVersion = require('latest-version');

const PROJECT_DEV_DEPENDENCY_DICT = {
  typescript: '3',
  '@magicspace/eslint-plugin': '0',
  '@magicspace/configs': '0',
};

module.exports = async () => {
  console.info(
    `Fetching dependency versions of ${Object.keys(PROJECT_DEV_DEPENDENCY_DICT)
      .map(name => `"${name}"`)
      .join(', ')}...`,
  );

  let devDependencies = Object.fromEntries(
    await Promise.all(
      Object.entries(
        PROJECT_DEV_DEPENDENCY_DICT,
      ).map(async ([name, versionRange]) => [
        name,
        `^${await latestVersion(name, versionRange)}`,
      ]),
    ),
  );

  return [
    json('package.json', value => {
      return {
        ...value,
        devDependencies: {
          ...value.devDependencies,
          ...devDependencies,
        },
      };
    }),
  ];
};
