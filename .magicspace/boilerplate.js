// @ts-check

module.exports = {
  boilerplate: '../typescript/bld/library/index.js',
  options: {
    name: '@mufan/code-boilerplates',
    description: 'Code boilerplates for Mufan',
    repository: 'https://github.com/makeflow/mufan-code-boilerplates.git',
    license: 'MIT',
    author: 'Chengdu Mufan Technology Co., Ltd.',
    projects: [
      {
        name: 'general-composables',
        parentDir: 'general',
        dir: 'composables',
        references: ['general'],
      },
      {
        name: 'general',
        type: 'library',
        parentDir: 'general',
        dir: 'library',
      },
      {
        name: 'typescript-composables',
        parentDir: 'typescript',
        dir: 'composables',
        references: ['typescript', 'general'],
      },
      {
        name: 'typescript',
        type: 'library',
        parentDir: 'typescript',
        dir: 'library',
        references: ['general'],
      },
    ],
  },
};
