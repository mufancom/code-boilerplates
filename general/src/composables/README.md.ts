import * as Path from 'path';

import {composable, handlebars} from '@magicspace/core';

import type {
  BadgesOptions,
  LicenseName,
  ResolvedOptions,
} from '../library/index.js';

import {TEMPLATES_DIR} from './@constants.js';

const TEMPLATE_PATH = Path.join(TEMPLATES_DIR, 'README.md.hbs');

export default composable<ResolvedOptions>(
  ({
    name,
    description = 'Just another awesome magic.',
    repository,
    license,
    badges: badgeOptions,
    packages,
  }) => {
    const data = {
      license,
      description,
    };

    return [
      handlebars(
        'README.md',
        {
          name,
          badges: buildBadges(name, repository, license, badgeOptions),
          ...data,
        },
        {
          template: TEMPLATE_PATH,
        },
      ),
      ...packages.map(({name, resolvedDir}) => {
        return handlebars(
          Path.join(resolvedDir, 'README.md'),
          {
            name,
            badges: buildBadges(name, repository, license, badgeOptions),
            ...data,
          },
          {
            template: TEMPLATE_PATH,
          },
        );
      }),
    ];
  },
);

interface Badge {
  title: string;
  image: string;
  url: string;
}

function buildBadges(
  name: string,
  repository: string | undefined,
  license: LicenseName | undefined,
  options: BadgesOptions | undefined,
): Badge[] {
  const {
    npm: npmBadge = false,
    repo: repoBadge = false,
    coverage: coverageBadge = false,
    license: licenseBadge = false,
  } = options ?? {};

  const badges: Badge[] = [];

  if (npmBadge) {
    badges.push({
      title: 'NPM version',
      image: `https://img.shields.io/npm/v/${name}?color=%23cb3837&style=flat-square`,
      url: `https://www.npmjs.com/package/${name}`,
    });
  }

  if (repoBadge) {
    const specifier = requireRepositorySpecifier();

    badges.push({
      title: 'Repository package.json version',
      image: `https://img.shields.io/github/package-json/v/${specifier}?color=%230969da&label=repo&style=flat-square`,
      url: `./package.json`,
    });
  }

  if (coverageBadge) {
    const specifier = requireRepositorySpecifier();

    badges.push({
      title: 'Coverage',
      image: `https://img.shields.io/coveralls/github/${specifier}?style=flat-square`,
      url: `https://coveralls.io/github/${specifier}`,
    });
  }

  if (licenseBadge) {
    if (license === undefined) {
      throw new Error('Project `license` not specified.');
    }

    badges.push({
      title: `${license} License`,
      image: `https://img.shields.io/badge/license-${encodeURIComponent(
        license,
      )}-999999?style=flat-square`,
      url: `./LICENSE`,
    });
  }

  return badges;

  function requireRepositorySpecifier(): string {
    if (repository === undefined) {
      throw new Error('Project `repository` not specified.');
    }

    const [, specifier] = repository.match(/([^/]+\/[^/]+?)(?:\.git)?$/)!;

    return specifier;
  }
}
