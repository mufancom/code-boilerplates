import * as Path from 'path';

export const BOILERPLATE_ROOT = Path.join(__dirname, '../..');

export const FILES_DIR = Path.join(BOILERPLATE_ROOT, 'files');

export const TEMPLATES_DIR = Path.join(BOILERPLATE_ROOT, 'templates');

export const TEMPLATES_CLIENT_DIR = Path.join(TEMPLATES_DIR, 'client');

export const TEMPLATES_CLIENT_PAGES_DIR = Path.join(
  TEMPLATES_CLIENT_DIR,
  'pages',
);
