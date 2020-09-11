"use strict";
/// <reference path="../../boilerplate.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveOptions = void 0;
const tslib_1 = require("tslib");
const Path = tslib_1.__importStar(require("path"));
const lodash_1 = tslib_1.__importDefault(require("lodash"));
function resolveOptions({ packagesDir, packages, ...rest }) {
    let resolvedPackages;
    if (packages || packagesDir !== undefined) {
        if (packagesDir === undefined) {
            packagesDir = 'packages';
        }
        resolvedPackages = (packages !== null && packages !== void 0 ? packages : []).map(packageOptions => {
            let dir = Path.posix.join(packagesDir, packageOptions.dir || packageOptions.name.replace(/^@[^/]+/, ''));
            return {
                ...packageOptions,
                dir,
                packageJSONPath: Path.posix.join(dir, 'package.json'),
            };
        });
    }
    else {
        resolvedPackages = [
            {
                ...lodash_1.default.omit(rest, [
                    'description',
                    'repository',
                    'license',
                    'author',
                    'prettier',
                ]),
                dir: '',
                packageJSONPath: 'package.json',
            },
        ];
    }
    return {
        packagesDir,
        packages: resolvedPackages,
        ...rest,
    };
}
exports.resolveOptions = resolveOptions;
