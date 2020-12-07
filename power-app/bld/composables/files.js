"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@magicspace/core");
const _constants_1 = require("./@constants");
exports.default = core_1.copy(_constants_1.FILES_DIR, '**');
