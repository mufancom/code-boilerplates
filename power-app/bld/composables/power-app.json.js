"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@magicspace/core");
const composable = async ({ name, powerApp: { port }, }) => {
    return [
        core_1.json('power-app.json', (data) => {
            return {
                ...data,
                name,
                version: '0.1.0',
                displayName: 'PowerApp',
                hookBaseURL: `https://power-apps.makeflow.com/${name}/api`,
            };
        }),
        core_1.json('power-app.dev.json', (data) => {
            return {
                ...data,
                name,
                version: '0.1.0',
                displayName: 'PowerApp',
                hookBaseURL: `http://localhost:${port}/api`,
            };
        }),
    ];
};
exports.default = composable;
