"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@magicspace/core");
const composable = ({ name, powerApp: { port, images }, }) => {
    return core_1.yaml('docker-compose.yml', {
        version: '3',
        services: {
            mongo: {
                image: 'mongo:latest',
                restart: 'always',
                volumes: [`makeflow-${name}_data:/data/db/`],
            },
            ...((images === null || images === void 0 ? void 0 : images.length) ? images.reduce((dict, image) => {
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
                depends_on: ['mongo', ...(images !== null && images !== void 0 ? images : [])],
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
exports.default = composable;
