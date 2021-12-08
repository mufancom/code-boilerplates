import {text} from '@magicspace/core';

export default text(
  '.gitignore',
  content =>
    `${content}\
# Digshare Build Out
out/
# config
.config.js
`,
);
