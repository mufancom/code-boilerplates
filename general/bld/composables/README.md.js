"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Path = tslib_1.__importStar(require("path"));
const core_1 = require("@magicspace/core");
const library_1 = require("../library");
const _constants_1 = require("./@constants");
const TEMPLATE_PATH = Path.join(_constants_1.TEMPLATES_DIR, 'README.md.hbs');
const composable = options => {
    let data = {
        license: options.license,
    };
    let { packages } = library_1.resolveOptions(options);
    return [
        core_1.handlebars('README.md', {
            name: options.name,
            ...data,
        }, {
            template: TEMPLATE_PATH,
        }),
        ...packages.map(packageOptions => core_1.handlebars(Path.join(packageOptions.dir, 'README.md'), {
            name: packageOptions.name,
            ...data,
        }, {
            template: TEMPLATE_PATH,
        })),
    ];
};
exports.default = composable;
