import type {BoilerplateExample} from '@magicspace/core';

export const examples: BoilerplateExample[] = [
  {
    name: 'basic',
    description: 'basic usage',
    options: {
      name: 'awesome-project',
      license: 'MIT',
      author: 'Awesome Author',
    },
  },
  {
    name: 'multiple packages',
    description: 'multiple packages with workspaces',
    options: {
      name: 'awesome-project',
      license: 'MIT',
      author: 'Awesome Author',
      packages: [
        {
          name: '@awesome/server',
        },
        {
          name: '@awesome/client',
        },
      ],
    },
  },
];
