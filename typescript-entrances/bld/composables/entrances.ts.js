"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Path = tslib_1.__importStar(require("path"));
const core_1 = require("@magicspace/core");
const _constants_1 = require("./@constants");
const _utils_1 = require("./@utils");
const TEMPLATE_PATH = Path.join(_constants_1.TEMPLATES_DIR, '@entrances.ts.hbs');
const composable = options => {
    let projects = _utils_1.resolveTypeScriptProjectsWithEntrances(options);
    return projects.flatMap(project => project.entrances.map(name => core_1.handlebars(Path.join(project.srcDir, `${name}.ts`), {}, { template: TEMPLATE_PATH })));
};
exports.default = composable;
