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
        volumes: [`makeflow-${name}_data:/data/db/`],
      },
      ...(images?.length
        ? images.reduce<{[key in string]: {image: string; volumes: string[]}}>(
            (dict, image) => {
              dict[image] = {
                image: `${image}:latest`,
                volumes: [`makeflow-${name}_data:/data/${image}/`],
              };

              return dict;
            },
            {},
          )
        : {}),
      [`makeflow_${name.replace(/-/g, '_')}`]: {
        image: `makeflow-${name}:\${VERSION:-latest}`,
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
