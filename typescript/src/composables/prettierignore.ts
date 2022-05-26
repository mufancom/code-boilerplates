import {text} from '@magicspace/core';

export default text(
  '.prettierignore',
  content => `${content}\
# TypeScript Build Artifacts
bld/
`,
);
