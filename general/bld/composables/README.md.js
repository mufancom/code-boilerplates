"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Path = tslib_1.__importStar(require("path"));
const core_1 = require("@magicspace/core");
const _constants_1 = require("./@constants");
const composable = options => core_1.handlebars(options, {
    template: Path.join(_constants_1.TEMPLATES_DIR, 'README.md.hbs'),
});
exports.default = composable;
