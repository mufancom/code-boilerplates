import {text} from '@magicspace/core';

export default text(
  '.prettierignore',
  content => `${content}\
# Digshare Build Artifacts
out/
`,
);
