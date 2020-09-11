"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveTypeScriptProjectsWithEntrances = void 0;
const tslib_1 = require("tslib");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const library_1 = require("../../../typescript/bld/library");
function resolveTypeScriptProjectsWithEntrances(options) {
    let { projects } = library_1.resolveTypeScriptProjects(options);
    return lodash_1.default.compact(projects.map(({ entrances = false, ...rest }) => {
        if (!entrances) {
            return undefined;
        }
        if (entrances === true) {
            entrances = ['@entrances'];
        }
        return {
            entrances,
            ...rest,
        };
    }));
}
exports.resolveTypeScriptProjectsWithEntrances = resolveTypeScriptProjectsWithEntrances;
