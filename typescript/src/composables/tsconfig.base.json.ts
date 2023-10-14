import {json} from '@magicspace/core';

export default json('tsconfig.base.json', {
  compilerOptions: {
    target: 'ES2018',

    module: 'NodeNext',
    moduleResolution: 'NodeNext',

    lib: ['ESNext'],
    types: [],

    importHelpers: true,
    esModuleInterop: true,
    stripInternal: true,
    sourceMap: true,

    strict: true,
    noImplicitReturns: true,
    noImplicitOverride: true,
    noFallthroughCasesInSwitch: true,
    useDefineForClassFields: true,
    skipLibCheck: true,

    newLine: 'LF',
  },
});
