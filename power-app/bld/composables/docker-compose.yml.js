"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@magicspace/core");
const composable = ({ name, powerApp: { port } }) => {
    return [
        core_1.text('.env', content => `${content}\
version: '3'
services:
  mongo:
    image: mongo:latest
    volumes:
      - makeflow-${name}_mongo_data:/data/db/
  redis:
    image: redis:latest
    volumes:
      - makeflow-${name}_redis_data:/data/db/
  makeflow_repeat_task:
    image: makeflow-${name}:\${VERSION:-latest}
    build:
      context: .
      args:
        - HTTP_PROXY
    depends_on:
      - mongo
      - redis
    ports:
      - '${port}:${port}'

volumes:
  makeflow-${name}_mongo_data:
    external: true
  makeflow-${name}_redis_data:
    external: true

      `),
    ];
};
exports.default = composable;
