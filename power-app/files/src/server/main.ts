import {createServer} from 'http';
import {join} from 'path';

import {PowerApp} from '@makeflow/power-app';
import {koaAdapter} from '@makeflow/power-app-koa';
import httpProxyMiddleware from 'http-proxy-middleware';
import Koa, {Middleware} from 'koa';
import koaConnect from 'koa-connect';
import koaMount from 'koa-mount';
import Router from 'koa-router';
import koaStatic from 'koa-static';
import SocketIO from 'socket.io';

import {DevConfig, ProductionConfig, getConfig} from './config';
import * as versions from './version';

declare global {
  namespace NodeJS {
    interface Global {
      context: Readonly<PowerAppContext>;
    }
  }

  interface PowerAppContext {
    powerApp: PowerApp;
    socket: SocketIO.Server;
  }
}

const config = getConfig();

const app = new Koa();
const server = createServer(app.callback());
const socket = SocketIO(server);
const powerApp = new PowerApp({
  db: {
    type: 'mongo',
    options: config.mongo,
  },
});

for (const [version, definition] of Object.values(versions).flatMap(
  Object.entries,
)) {
  powerApp.version(version, definition);
}

app
  .use(
    powerApp.middleware(koaAdapter, {
      path: '/api',
    }),
  )
  .use(
    config.production ? productionMiddleware(config) : devMiddleware(config),
  );

// register
global.context = {powerApp, socket};

// start
server.listen(config.port);

function devMiddleware(config: DevConfig): Middleware {
  let proxyApp = new Koa<{}, {}>();
  let proxyRouter = new Router<{}, {}>();
  let proxyMiddleware = koaConnect(
    httpProxyMiddleware({
      target: `http://localhost:${config.client.port}`,
    }),
  );
  proxyRouter.all('/(.*)', (context, next) => proxyMiddleware(context, next));
  proxyApp.use(proxyRouter.routes());
  return koaMount(proxyApp);
}

function productionMiddleware(_config: ProductionConfig): Middleware {
  return koaMount('/app', koaStatic(join(__dirname, '../client')));
}
