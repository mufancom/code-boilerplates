import {createServer} from 'http';

import {PowerApp} from '@makeflow/power-app';
import {koaAdapter} from '@makeflow/power-app-koa';
import Koa from 'koa';
import SocketIO from 'socket.io';

import {getConfig} from './config';
import {
  GetPageURL,
  buildPageURLHelper,
  initializeAuth,
  initializeClient,
  initializePowerAppVersion,
} from './helper';
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
    helper: {
      page: {
        getPageURL: GetPageURL;
      };
    };
  }
}

const config = getConfig();
const app = new Koa();
const server = createServer(app.callback());
const io = SocketIO(server);
const powerApp = new PowerApp({
  db: {
    type: 'mongo',
    options: config.mongo,
  },
});

app.use(
  powerApp.middleware(koaAdapter, {
    path: '/api',
  }),
);

initializeAuth(io);
initializePowerAppVersion(powerApp, versions);
initializeClient(app, config);

// register
global.context = {
  powerApp,
  socket: io,
  helper: {
    page: {
      getPageURL: buildPageURLHelper(config),
    },
  },
};

// start
server.listen(config.port);
