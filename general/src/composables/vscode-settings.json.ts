import {json} from '@magicspace/core';

export default json('.vscode/settings.json', {
  'editor.tabSize': 2,
  'editor.insertSpaces': true,
  'editor.formatOnSave': true,
  'editor.codeActionsOnSave': {
    'source.fixAll.eslint': true,
  },
  'editor.defaultFormatter': 'esbenp.prettier-vscode',
  'editor.rulers': [80],
  'files.associations': {
    'boilerplate.json': 'jsonc',
  },
  'files.eol': '\n',
  'files.insertFinalNewline': true,
  'files.trimTrailingWhitespace': true,
  'eslint.validate': ['javascript', 'javascriptreact'],
});
