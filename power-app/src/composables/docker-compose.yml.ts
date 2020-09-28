import {ComposableModuleFunction, text} from '@magicspace/core';

const composable: ComposableModuleFunction = ({
  name,
  powerApp: {port, images},
}) => {
  return [
    text(
      'docker-compose.yml',
      content => `${content}\
version: '3'
services:
  mongo:
    image: mongo:latest
    volumes:
      - makeflow-${name}_data:/data/db/
  ${
    images?.length
      ? images
          .map(
            image => `${image}:
    image: ${image}:latest
    volumes:
      - makeflow-${name}_data:/data/${image}/`,
          )
          .join('\n')
      : ''
  }
  makeflow_repeat_task:
    image: makeflow-${name}:\${VERSION:-latest}
    build:
      context: .
    depends_on:
      - mongo
      ${images?.length ? images.map(image => `-${image}`).join('\n') : ''}
    ports:
      - '${port}:${port}'

volumes:
  makeflow-${name}_data:
    external: true
      `,
    ),
  ];
};

export default composable;
