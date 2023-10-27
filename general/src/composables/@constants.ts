import * as Path from 'path';
import {fileURLToPath} from 'url';

export const BOILERPLATE_ROOT = Path.join(
  fileURLToPath(import.meta.url),
  '../../..',
);

export const FILES_DIR = Path.join(BOILERPLATE_ROOT, 'files');
export const TEMPLATES_DIR = Path.join(BOILERPLATE_ROOT, 'templates');
export const LICENSE_TEMPLATES_DIR = Path.join(TEMPLATES_DIR, 'licenses');
