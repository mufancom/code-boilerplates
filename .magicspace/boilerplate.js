// @ts-check

export default {
  boilerplate: '../typescript',
  options: {
    name: '@mufan/code-boilerplates',
    description: 'Code boilerplates for Mufan',
    repository: 'https://github.com/makeflow/mufan-code-boilerplates.git',
    license: 'MIT',
    author: 'Chengdu Mufan Technology Co., Ltd.',
    tsProjects: [
      {
        name: 'general-composables',
        parentDir: 'general',
        dir: 'composables',
        references: ['general'],
      },
      {
        name: 'general',
        type: 'library',
        exportAs: false,
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
        exportAs: false,
        parentDir: 'typescript',
        dir: 'library',
        references: ['general'],
      },
    ],
  },
};
