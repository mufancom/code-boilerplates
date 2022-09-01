import {text} from '@magicspace/core';

export default text(
  '.gitignore',
  content => `${content}\
# TypeScript Build Artifacts
bld/
*.tsbuildinfo
`,
);
