import {text} from '@magicspace/core';

export default text(
  '.gitignore',
  `\
# General
.DS_Store
*.tgz
node_modules/
yarn-error.log
npm-debug.log
`,
);
