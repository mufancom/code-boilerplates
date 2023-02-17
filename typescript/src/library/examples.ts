import type {BoilerplateExample} from '@magicspace/core';

export const examples: BoilerplateExample[] = [
  {
    name: 'library',
    description: 'single-package library',
    options: {
      name: 'awesome-library',
      license: 'MIT',
      author: 'Awesome Author',
      projects: [
        {
          name: 'library',
        },
        {
          name: 'test',
          references: ['library'],
        },
      ],
    },
  },
  {
    name: 'program',
    description: 'single-package program',
    options: {
      name: 'awesome-program',
      license: 'MIT',
      author: 'Awesome Author',
      projects: [
        {
          name: 'program',
        },
        {
          name: 'test',
          references: ['program'],
        },
      ],
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
          name: '@awesome/core',
          projects: [
            {
              name: 'library',
            },
            {
              name: 'test',
              references: ['library'],
            },
          ],
        },
        {
          name: '@awesome/server',
          projects: [
            {
              name: 'program',
            },
            {
              name: 'test',
              references: ['program'],
            },
          ],
        },
        {
          name: '@awesome/client',
          projects: [
            {
              name: 'program',
            },
            {
              name: 'test',
              references: ['program'],
            },
          ],
        },
      ],
    },
  },
];
