import {join} from 'path';

import httpProxyMiddleware from 'http-proxy-middleware';
import Koa, {Middleware} from 'koa';
import koaConnect from 'koa-connect';
import koaMount from 'koa-mount';
import Router from 'koa-router';
import koaStatic from 'koa-static';

import {Config} from '../config';

export function initializeClient(app: Koa, config: Config): void {
  app.use(clientMiddleware(config));
}

function clientMiddleware(config: Config): Middleware {
  return config.production
    ? koaMount('/app', koaStatic(join(__dirname, '../../client')))
    : koaMount(
        new Koa().use(
          new Router()
            .all('/(.*)', (context, next) =>
              koaConnect(
                httpProxyMiddleware({
                  target: `http://localhost:${config.client.port}`,
                }),
              )(context, next),
            )
            .routes(),
        ),
      );
}
