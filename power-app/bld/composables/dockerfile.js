"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@magicspace/core");
const composable = ({ powerApp: { port } }) => {
    return [
        core_1.text('Dockerfile', content => `${content}\
FROM node:12

WORKDIR /app

COPY .npmrc                 /app/.npmrc
COPY package.json           /app/package.json
COPY yarn.lock              /app/yarn.lock
COPY .env                   /app/.env
COPY .env.production        /app/.env.production
COPY src/                   /app/src/


RUN yarn build

ENV NODE_ENV=production
ENV PORT=${port}

EXPOSE ${port}

CMD node bld/server/main.js

      `),
    ];
};
exports.default = composable;
