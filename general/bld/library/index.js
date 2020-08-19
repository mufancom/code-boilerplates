"use strict";
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../boilerplate.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveOptions = void 0;
const tslib_1 = require("tslib");
const Path = tslib_1.__importStar(require("path"));
function resolveOptions({ packagesDir = 'packages', packages = [], ...rest }) {
    return {
        ...rest,
        packagesDir,
        packages: packages.map(packageOptions => {
            return {
                ...packageOptions,
                dir: Path.posix.join(packagesDir, packageOptions.dir || packageOptions.name.replace(/^@[^/]+/, '')),
            };
        }),
    };
}
exports.resolveOptions = resolveOptions;
