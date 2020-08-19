"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@magicspace/core");
exports.default = core_1.text('.gitignore', `\
# General
.DS_Store
*.tgz
node_modules/
yarn-error.log
npm-debug.log
`);
