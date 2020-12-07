import {text} from '@magicspace/core';

export default text('.gitignore', content =>
  content.includes('db.json')
    ? content
    : `${content}\
# Parcel cache
.cache
# Power app data
db.json
`,
);
