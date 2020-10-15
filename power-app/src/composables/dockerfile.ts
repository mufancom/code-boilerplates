import {ComposableModuleFunction, text} from '@magicspace/core';

const composable: ComposableModuleFunction = ({powerApp: {port}}) => {
  return [
    text(
      'Dockerfile',
      content => `${content}\
FROM node:12

WORKDIR /app

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

      `,
    ),
  ];
};

export default composable;
