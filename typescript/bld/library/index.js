"use strict";
/// <reference path="../../boilerplate.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveTypeScriptProjects = void 0;
const tslib_1 = require("tslib");
const Path = tslib_1.__importStar(require("path"));
const library_1 = require("../../../general/bld/library");
function resolveTypeScriptProjects(options) {
    let packageOptions = library_1.resolveOptions(options);
    return {
        projects: [
            ...packageOptions.packages.flatMap(packageOptions => { var _a, _b; return (_b = (_a = packageOptions.tsProjects) === null || _a === void 0 ? void 0 : _a.map(project => buildResolvedTypeScriptProjectOptions(project, packageOptions))) !== null && _b !== void 0 ? _b : []; }),
        ],
        package: packageOptions,
    };
}
exports.resolveTypeScriptProjects = resolveTypeScriptProjects;
function buildResolvedTypeScriptProjectOptions({ name, type = name && name.includes('library') ? 'library' : 'program', dev = (name && name.includes('test')) || type === 'script' ? true : false, parentDir = '', src = 'src', dir = name !== null && name !== void 0 ? name : 'program', noEmit = type === 'script', ...rest }, packageOptions) {
    var _a;
    let packageDir = (_a = packageOptions === null || packageOptions === void 0 ? void 0 : packageOptions.dir) !== null && _a !== void 0 ? _a : '';
    let srcDir = Path.posix.join(packageDir, parentDir, src || '', dir);
    let outDir = Path.posix.join(packageDir, parentDir, noEmit ? '.bld-cache' : 'bld', dir);
    return {
        srcDir,
        outDir,
        tsconfigPath: Path.posix.join(srcDir, 'tsconfig.json'),
        type,
        dev,
        noEmit,
        package: packageOptions,
        ...rest,
    };
}
