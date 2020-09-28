import {ComposableModuleFunction, json} from '@magicspace/core';
import {fetchPackageVersions, sortObjectKeys} from '@magicspace/utils';

const DEPENDENCY_DICT = {
  '@loadable/component': '^5.13.2',
  '@makeflow/power-app': '^0.3.0-wip',
  '@makeflow/power-app-koa': '^0.3.0-wip',
  classnames: '^2.2.0',
  'dotenv-flow': '^3.2.0',
  'http-proxy-middleware': '^0.19.0',
  koa: '^2.13.0',
  'koa-connect': '^2.1.0',
  'koa-mount': '^4.0.0',
  'koa-router': '^9.4.0',
  'koa-static': '^5.0.0',
  'normalize.css': '^8.0.0',
  react: '^16.13.0',
  'react-dom': '^16.13.0',
  'react-router-dom': '^5.2.0',
  'socket.io': '^2.3.0',
  'styled-components': '^5.2.0',
  uuid: '^8.3.0',
};

const DEV_DEPENDENCIES_DICT = {
  '@babel/core': '^7.11.0',
  '@loadable/babel-plugin': '^5.13.0',
  '@makeflow/cli': '^0.3.0-wip',
  '@types/classnames': '^2.2.0',
  '@types/dotenv-flow': '^3.1.0',
  '@types/http-proxy-middleware': '^0.19.0',
  '@types/koa': '^2.11.4',
  '@types/koa-mount': '^4.0.0',
  '@types/koa-router': '^7.4.1',
  '@types/koa-static': '^4.0.1',
  '@types/loadable__component': '^5.13.0',
  '@types/node': '^14.10.0',
  '@types/react': '^16.9.0',
  '@types/react-dom': '^16.9.0',
  '@types/react-router-dom': '^5.1.0',
  '@types/socket.io': '^2.1.11',
  '@types/uuid': '^8.3.0',
  '@types/styled-components': '^5.1.0',
  'cross-env': '^7.0.0',
  'dotenv-cli': '^4.0.0',
  'parcel-bundler': '^1.12.0',
  'ts-node-dev': '^1.0.0-pre',
};

const composable: ComposableModuleFunction = async () => {
  let dependencies = await fetchPackageVersions(DEPENDENCY_DICT);
  let devDependencies = await fetchPackageVersions(DEV_DEPENDENCIES_DICT);

  return [
    json('package.json', (data: any) => {
      return {
        ...data,
        scripts: sortObjectKeys(
          {
            ...data.scripts,
            build:
              'yarn && rimraf ./bld && yarn build:server && yarn build:client',
            'build:client':
              "dotenv -c production -- bash -c 'parcel build src/client/index.html --public-url $PUBLIC_URL --no-source-maps --out-dir bld/client'",
            'build:server': 'tsc --P ./src/server/tsconfig.json',
            serve:
              'tsnd --respawn --P ./src/server/tsconfig.json --T ./src/server/main.ts ',
            start:
              "dotenv -c development -- bash -c 'yarn parcel src/client/index.html --open -p $CLIENT_PORT --out-dir bld/client'",
            'power-publish-dev': 'yarn mf publish ./power-app.dev.json',
          },
          'asc',
        ),
        dependencies: sortObjectKeys(
          {
            ...data.dependencies,
            ...dependencies,
          },
          'asc',
        ),
        devDependencies: sortObjectKeys(
          {
            ...data.devDependencies,
            ...devDependencies,
          },
          'asc',
        ),
      };
    }),
  ];
};

export default composable;
