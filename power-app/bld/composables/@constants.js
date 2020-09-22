"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FILES_DIR = exports.BOILERPLATE_ROOT = void 0;
const tslib_1 = require("tslib");
const Path = tslib_1.__importStar(require("path"));
exports.BOILERPLATE_ROOT = Path.join(__dirname, '../..');
exports.FILES_DIR = Path.join(exports.BOILERPLATE_ROOT, 'files');
