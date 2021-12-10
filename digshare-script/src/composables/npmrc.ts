import {text} from '@magicspace/core';

export default text('.npmrc', content => content ?? '');
