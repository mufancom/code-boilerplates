import React, {FC, createContext, useContext, useEffect, useState} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import io from 'socket.io-client';

const PRODUCTION = process.env.NODE_ENV === 'production';
const HOST = process.env.HOST;
const APP_NAME = process.env.APP_NAME;
const PORT = process.env.SERVER_PORT;

interface SocketContext {
  socket: SocketIOClient.Socket | undefined;
}

const socketContext = createContext<SocketContext>({socket: undefined});

export const useSocket = (): SocketContext => useContext(socketContext);

export const Authorization: FC = ({children}) => {
  let [socket] = useState(
    io(PRODUCTION ? HOST! : `http://localhost:${PORT}`, {
      path: `${PRODUCTION ? `/${APP_NAME}/` : ''}/socket.io`,
    }),
  );

  let location = useLocation();
  let history = useHistory();

  useEffect(() => {
    let code = new URLSearchParams(location.search).get('code');
    let page = location.pathname.slice(1);

    socket.on('connect', () => {
      socket.emit(
        'page:auth',
        {app: APP_NAME, page, code},
        (succeed: boolean) => {
          console.info(`auth ${succeed}!`);
        },
      );
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <socketContext.Provider value={{socket}}>{children}</socketContext.Provider>
  );
};
