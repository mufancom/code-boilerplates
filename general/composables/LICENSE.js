const FS = require('fs');
const Path = require('path');

const {handlebars} = require('@magicspace/core');

const LICENSES_DIR = Path.join(__dirname, 'licenses');

module.exports = ({project: {license, author}}) => {
  if (!license) {
    return undefined;
  }

  let licenses = FS.readdirSync(LICENSES_DIR).map(fileName =>
    Path.basename(fileName, '.txt'),
  );

  if (!licenses.includes(license)) {
    console.warn(
      `No license template found for ${JSON.stringify(license)}, use one of:`,
    );
    console.warn(licenses.map(license => `  - ${license}`).join('\n'));
    return undefined;
  }

  return handlebars(
    {
      year: new Date().getFullYear(),
      organization: author || '{{ organization }}',
    },
    {
      template: Path.join(LICENSES_DIR, `${license}.txt`),
      noEscape: true,
    },
  );
};
