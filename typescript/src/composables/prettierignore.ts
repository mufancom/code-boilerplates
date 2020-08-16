import {text} from '@magicspace/core';

export default text('.prettierignore', content => {
  return `${content}\
bld/
`;
});
