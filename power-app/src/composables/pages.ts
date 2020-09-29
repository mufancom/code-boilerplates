import * as Path from 'path';

import {ComposableModuleFunction, handlebars} from '@magicspace/core';

import {resolveTypeScriptProjects} from '../../../typescript/bld/library';

import {
  TEMPLATES_CLIENT_DIR,
  TEMPLATES_CLIENT_PAGES_DIR,
  TEMPLATES_SERVER_HELPER_DIR,
} from './@constants';

const APP_PATH = Path.join(TEMPLATES_CLIENT_DIR, 'app.tsx.hbs');

const PAGE_INDEX_PATH = Path.join(TEMPLATES_CLIENT_PAGES_DIR, 'index.ts.hbs');

const PAGE_COMPONENT_PATH = Path.join(
  TEMPLATES_CLIENT_PAGES_DIR,
  '@page',
  'index.tsx.hbs',
);

const PAGE_HELPER_PATH = Path.join(TEMPLATES_SERVER_HELPER_DIR, 'page.ts.hbs');

const composable: ComposableModuleFunction = options => {
  let {
    powerApp: {pages = []},
  } = options;
  let projects = resolveTypeScriptProjects(options);

  let clientSrc = projects.projects.find(project =>
    project.srcDir.includes('client'),
  )!.srcDir;

  let serverSrc = projects.projects.find(project =>
    project.srcDir.includes('server'),
  )!.srcDir;

  let pagesInfos = pages.map(page => ({
    name: page,
    componentName: pageToComponentName(page),
  }));

  return [
    handlebars(
      Path.join(clientSrc, 'app.tsx'),
      {
        pages: pagesInfos,
      },
      {template: APP_PATH},
    ),
    handlebars(
      Path.join(clientSrc, 'pages', 'index.ts'),
      {
        pages: pagesInfos,
      },
      {template: PAGE_INDEX_PATH},
    ),
    handlebars(
      Path.join(serverSrc, 'helper', 'page.ts'),
      {
        pageTypeString: pages.map(page => `'${page}'`).join(' | '),
      },
      {template: PAGE_HELPER_PATH},
    ),
    ...pagesInfos.map(page =>
      handlebars(
        Path.join(clientSrc, 'pages', `@${page.name}`, 'index.tsx'),
        page,
        {
          template: PAGE_COMPONENT_PATH,
        },
      ),
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
