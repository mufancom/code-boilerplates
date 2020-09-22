"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@magicspace/core");
exports.default = core_1.text('.gitignore', content => content.includes('db.json')
    ? content
    : `${content}\
# Parcel cache
.cache
# Power app data
db.json
`);
