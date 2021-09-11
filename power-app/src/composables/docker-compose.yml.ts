import {ComposableModuleFunction, yaml} from '@magicspace/core';

const composable: ComposableModuleFunction = ({
  name,
  powerApp: {port, images},
}) => {
  return yaml('docker-compose.yml', {
    version: '3',
    services: {
      mongo: {
        image: 'mongo:latest',
        restart: 'always',
        volumes: [`makeflow-${name}_data:/data/db/`],
      },
      ...(images?.length
        ? images.reduce<{
            [key in string]: {
              image: string;
              restart: 'always';
              volumes: string[];
            };
          }>((dict, image) => {
            dict[image] = {
              image: `${image}:latest`,
              restart: 'always',
              volumes: [`makeflow-${name}_data:/data/${image}/`],
            };

            return dict;
          }, {})
        : {}),
      [`makeflow_${name.replace(/-/g, '_')}`]: {
        image: `makeflow-${name}:\${VERSION:-latest}`,
        restart: 'always',
        build: {
          context: '.',
        },
        depends_on: ['mongo', ...(images ?? [])],
        ports: [`${port}:${port}`],
      },
    },
    volumes: {
      [`makeflow-${name}_data`]: {
        external: true,
      },
    },
  });
};

export default composable;
