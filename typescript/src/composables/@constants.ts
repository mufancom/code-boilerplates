import * as Path from 'path';
import {fileURLToPath} from 'url';

export const BOILERPLATE_ROOT = Path.join(
  fileURLToPath(import.meta.url),
  '../../..',
);

export const TEMPLATES_DIR = Path.join(BOILERPLATE_ROOT, 'templates');
