"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@magicspace/core");
exports.default = core_1.text('.gitignore', content => `${content}\
# TypeScript Build Artifacts
bld/
.bld-cache/
`);
