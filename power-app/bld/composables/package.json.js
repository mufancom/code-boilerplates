"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@magicspace/core");
const utils_1 = require("@magicspace/utils");
const DEPENDENCY_DICT = {
    '@loadable/component': '^5.13.2',
    '@makeflow/power-app': '^0.3.0-wip',
    '@makeflow/power-app-koa': '^0.3.0-wip',
    classnames: '^2.2.0',
    dotenv: '^8.2.0',
    'main-function': '^0.1.0',
    'normalize.css': '^8.0.0',
    react: '^16.13.0',
    'react-dom': '^16.13.0',
    'react-router-dom': '^5.2.0',
    'styled-components': '^5.2.0',
};
const DEV_DEPENDENCIES_DICT = {
    '@babel/core': '^7.11.0',
    '@loadable/babel-plugin': '^5.13.0',
    '@makeflow/cli': '^0.3.0-wip',
    '@types/classnames': '^2.2.0',
    '@types/loadable__component': '^5.13.0',
    '@types/node': '^14.10.0',
    '@types/react': '^16.9.0',
    '@types/react-dom': '^16.9.0',
    '@types/react-router-dom': '^5.1.0',
    '@types/styled-components': '^5.1.0',
    'cross-env': '^7.0.0',
    'env-cmd': '^10.1.0',
    'parcel-bundler': '^1.12.0',
};
const composable = async () => {
    let dependencies = await utils_1.fetchPackageVersions(DEPENDENCY_DICT);
    let devDependencies = await utils_1.fetchPackageVersions(DEV_DEPENDENCIES_DICT);
    return [
        core_1.json('package.json', (data) => {
            return {
                ...data,
                scripts: {
                    ...data.scripts,
                    'build:client': 'env-cmd -f ./.env -x --use-shell "parcel build src/client/index.html --public-url $PUBLIC_URL --no-source-maps --out-dir bld/client',
                    start: 'env-cmd -f ./.env.development -x --use-shell "parcel src/client/index.html --public-url $PUBLIC_URL --open -p $CLIENT_PORT"',
                },
                dependencies: {
                    ...data.dependencies,
                    ...dependencies,
                },
                devDependencies: {
                    ...data.devDependencies,
                    ...devDependencies,
                },
            };
        }),
    ];
};
exports.default = composable;
