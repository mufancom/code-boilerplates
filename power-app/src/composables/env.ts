import {ComposableModuleFunction, text} from '@magicspace/core';

const composable: ComposableModuleFunction = ({name, powerApp: {port}}) => {
  return [
    text(
      '.env',
      content => `${content}\
# APP_NAME "应用名"
# HOST "访问地址 默认 http://localhost:{SERVER_PORT}"
# PUBLIC_URL "部署路径 默认 / "
# CLIENT_PORT "前端开发环境端口 默认{SERVER_PORT+1}"
# MONGO_URI "数据库地址"
# MONGO_NAME "默认等于 APP_NAME"
# SERVER_PORT "服务启动端口"

APP_NAME="${name}"
SERVER_PORT=${port}

      `,
    ),
    text(
      '.env.development',
      content => `${content}\
CLIENT_PORT=${port + 1}
MONGO_URI="mongodb://localhost:27017"

  `,
    ),
    text(
      '.env.production',
      content => `${content}\
HOST="https://power-apps.makeflow.com"
PUBLIC_URL="/${name}/app"
MONGO_URI="mongodb://mongo:27017"

  `,
    ),
  ];
};

export default composable;
