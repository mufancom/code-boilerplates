import {ActionStorage, Context, UserModel} from '@makeflow/power-app';
import Socket from 'socket.io';
import {v4 as uuid} from 'uuid';

declare module 'socket.io' {
  interface Socket {
    $user?: Context<'user'>;
  }
}

export interface Auth {
  app: string;
  page: string;
  code: string;
}

export function initializeAuth(io: Socket.Server): void {
  io.on('connection', socket => {
    socket.on('disconnect', () => (socket.$user = undefined));

    socket.on('page:auth', async (auth: Auth, fn: (res: any) => void) => {
      let user = await getAuthUser(auth);
      socket.$user = user;
      fn(!!user);
    });
  });
}

export async function generateAuthCode(
  storage: ActionStorage<UserModel, any>,
  {app, page}: Omit<Auth, 'code'>,
): Promise<string> {
  let code = uuid();

  await storage.set(['auth', app, page, 'code'] as any, code);

  return code;
}

export async function getAuthUser({
  app,
  page,
  code,
}: Auth): Promise<Context<'user', any> | undefined> {
  let [userContext] = await global.context.powerApp.getContexts('user', {
    storage: {
      auth: {
        [app]: {
          [page]: {
            code,
          },
        },
      },
    },
  });

  return userContext;
}
