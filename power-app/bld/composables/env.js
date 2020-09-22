"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@magicspace/core");
const composable = ({ name, powerApp: { port } }) => {
    return [
        core_1.text('.env', content => `${content}\
APP_NAME="${name}"
PUBLIC_URL="/${name}"
SERVER_PORT=${port}
MONGO_URI="mongodb://mongo:27017"
MONGO_NAME="${name}"

    `),
        core_1.text('.env.development', content => `${content}\
APP_NAME="${name}"
PUBLIC_URL="/"
 # development only
CLIENT_PORT=${port + 1}
SERVER_PORT=${port}
MONGO_URI="localhost:27017"
MONGO_NAME="${name}"

  `),
    ];
};
exports.default = composable;
