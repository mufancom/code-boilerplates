"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@magicspace/core");
const composable = ({ name, powerApp: { port, images }, }) => {
    return [
        core_1.text('docker-compose.yml', content => `${content}\
version: '3'
services:
  mongo:
    image: mongo:latest
    volumes:
      - makeflow-${name}_data:/data/db/
  ${(images === null || images === void 0 ? void 0 : images.length) ? images
            .map(image => `${image}:
    image: ${image}:latest
    volumes:
      - makeflow-${name}_data:/data/${image}/`)
            .join('\n')
            : ''}
  makeflow_repeat_task:
    image: makeflow-${name}:\${VERSION:-latest}
    build:
      context: .
    depends_on:
      - mongo
      ${(images === null || images === void 0 ? void 0 : images.length) ? images.map(image => `- ${image}`).join('\n') : ''}
    ports:
      - '${port}:${port}'

volumes:
  makeflow-${name}_data:
    external: true
      `),
    ];
};
exports.default = composable;
