"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const FS = tslib_1.__importStar(require("fs"));
const Path = tslib_1.__importStar(require("path"));
const core_1 = require("@magicspace/core");
const _constants_1 = require("./@constants");
const composable = ({ license, author }) => {
    if (!license) {
        return undefined;
    }
    let licenses = FS.readdirSync(_constants_1.LICENSE_TEMPLATES_DIR).map(fileName => Path.basename(fileName, '.txt'));
    if (!licenses.includes(license)) {
        console.warn(`No license boilerplate found for ${JSON.stringify(license)}, use one of:`);
        console.warn(licenses.map(license => `  - ${license}`).join('\n'));
        return undefined;
    }
    return core_1.handlebars({
        year: new Date().getFullYear(),
        organization: author || '{{ organization }}',
    }, {
        template: Path.join(_constants_1.LICENSE_TEMPLATES_DIR, `${license}.txt`),
        noEscape: true,
    });
};
exports.default = composable;
