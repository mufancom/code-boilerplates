import * as Path from 'path';

import {ComposableModuleFunction, handlebars} from '@magicspace/core';

import {resolveTypeScriptProjects} from '../../../typescript/bld/library';

import {TEMPLATES_CLIENT_DIR} from './@constants';

const APP_PATH = Path.join(TEMPLATES_CLIENT_DIR, 'app.tsx.hbs');

const PAGE_PATH = Path.join(TEMPLATES_CLIENT_DIR, 'pages');

const PAGE_INDEX_PATH = Path.join(PAGE_PATH, 'index.ts.hbs');

const PAGE_COMPONENT_PATH = Path.join(PAGE_PATH, '@page', 'index.tsx.hbs');

const composable: ComposableModuleFunction = options => {
  let {
    powerApp: {pages = []},
  } = options;
  let projects = resolveTypeScriptProjects(options);

  let clientProject = projects.projects.find(project =>
    project.srcDir.includes('client'),
  );

  let src = clientProject!.srcDir;

  let pagesInfos = pages.map(page => ({
    name: page,
    componentName: pageToComponentName(page),
  }));

  return [
    handlebars(
      Path.join(src, 'app.tsx'),
      {
        pages: pagesInfos,
      },
      {template: APP_PATH},
    ),
    handlebars(
      Path.join(src, 'pages', 'index.ts'),
      {
        pages: pagesInfos,
      },
      {template: PAGE_INDEX_PATH},
    ),
    ...pagesInfos.map(page =>
      handlebars(Path.join(src, 'pages', `@${page.name}`, 'index.tsx'), page, {
        template: PAGE_COMPONENT_PATH,
      }),
    ),
  ];
};

export default composable;

// hello-world => HelloWorld
function pageToComponentName(page: string): string {
  return page
    .split('-')
    .map(word => `${word[0].toLocaleUpperCase()}${word.slice(1)}`)
    .join('');
}
