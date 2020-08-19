"use strict";
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../boilerplate.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveTypeScriptProjects = void 0;
const tslib_1 = require("tslib");
const Path = tslib_1.__importStar(require("path"));
const library_1 = require("../../../general/bld/library");
function resolveTypeScriptProjects(options) {
    var _a;
    let packageOptions = library_1.resolveOptions(options);
    let { tsProjects, packages } = packageOptions;
    return {
        projects: [
            ...((_a = tsProjects === null || tsProjects === void 0 ? void 0 : tsProjects.map(project => buildResolvedTypeScriptProjectOptions(project))) !== null && _a !== void 0 ? _a : []),
            ...packages.flatMap(packageOptions => { var _a, _b; return (_b = (_a = packageOptions.tsProjects) === null || _a === void 0 ? void 0 : _a.map(project => buildResolvedTypeScriptProjectOptions(project, packageOptions))) !== null && _b !== void 0 ? _b : []; }),
        ],
        package: packageOptions,
    };
}
exports.resolveTypeScriptProjects = resolveTypeScriptProjects;
function buildResolvedTypeScriptProjectOptions({ name, type, dev }, packageOptions) {
    var _a;
    let packageDir = (_a = packageOptions === null || packageOptions === void 0 ? void 0 : packageOptions.dir) !== null && _a !== void 0 ? _a : '';
    let srcDir = Path.posix.join(packageDir, 'src', name);
    let outDir = Path.posix.join(packageDir, type === 'script' ? '.bld-cache' : 'bld', name);
    return {
        srcDir,
        outDir,
        tsconfigPath: Path.posix.join(srcDir, 'tsconfig.json'),
        type: type !== null && type !== void 0 ? type : (name === 'library' ? 'library' : 'program'),
        dev: (dev !== null && dev !== void 0 ? dev : name === 'test') ? true : false,
        package: packageOptions,
    };
}
