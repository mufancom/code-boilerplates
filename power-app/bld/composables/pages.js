"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Path = tslib_1.__importStar(require("path"));
const core_1 = require("@magicspace/core");
const library_1 = require("../../../typescript/bld/library");
const _constants_1 = require("./@constants");
const APP_PATH = Path.join(_constants_1.TEMPLATES_CLIENT_DIR, 'app.tsx.hbs');
const PAGE_PATH = Path.join(_constants_1.TEMPLATES_CLIENT_DIR, 'pages');
const PAGE_INDEX_PATH = Path.join(PAGE_PATH, 'index.ts.hbs');
const PAGE_COMPONENT_PATH = Path.join(PAGE_PATH, '@page', 'index.tsx.hbs');
const composable = options => {
    let { powerApp: { pages = [] }, } = options;
    let projects = library_1.resolveTypeScriptProjects(options);
    let clientProject = projects.projects.find(project => project.srcDir.includes('client'));
    let src = clientProject.srcDir;
    let pagesInfos = pages.map(page => ({
        name: page,
        componentName: pageToComponentName(page),
    }));
    return [
        core_1.handlebars(Path.join(src, 'app.tsx'), {
            pages: pagesInfos,
        }, { template: APP_PATH }),
        core_1.handlebars(Path.join(src, 'pages', 'index.ts'), {
            pages: pagesInfos,
        }, { template: PAGE_INDEX_PATH }),
        ...pagesInfos.map(page => core_1.handlebars(Path.join(src, 'pages', `@${page.name}`, 'index.tsx'), page, {
            template: PAGE_COMPONENT_PATH,
        })),
    ];
};
exports.default = composable;
// hello-world => HelloWorld
function pageToComponentName(page) {
    return page
        .split('-')
        .map(word => `${word[0].toLocaleUpperCase()}${word.slice(1)}`)
        .join('');
}
