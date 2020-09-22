import {ComposableModuleFunction, text} from '@magicspace/core';

const composable: ComposableModuleFunction = ({name, powerApp: {port}}) => {
  return [
    text(
      '.env',
      content => `${content}\
APP_NAME="${name}"
PUBLIC_URL="/${name}"
SERVER_PORT=${port}
MONGO_URI="mongodb://mongo:27017"
MONGO_NAME="${name}"

    `,
    ),
    text(
      '.env.development',
      content => `${content}\
APP_NAME="${name}"
PUBLIC_URL="/"
 # development only
CLIENT_PORT=${port + 1}
SERVER_PORT=${port}
MONGO_URI="localhost:27017"
MONGO_NAME="${name}"

  `,
    ),
  ];
};

export default composable;
