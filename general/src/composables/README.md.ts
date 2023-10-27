import * as Path from 'path';

import {composable, handlebars} from '@magicspace/core';

import type {
  ResolvedOptions,
  ResolvedPackageOptions,
} from '../library/index.js';

import {TEMPLATES_DIR} from './@constants.js';

const TEMPLATE_PATH = Path.join(TEMPLATES_DIR, 'README.md.hbs');

export default composable<ResolvedOptions>(options => {
  const {
    name,
    description = 'Just another awesome magic.',
    license,
    packages,
  } = options;

  const data = {
    license,
    description,
  };

  return [
    handlebars(
      'README.md',
      {
        name,
        badges: buildBadges(options, undefined),
        ...data,
      },
      {
        template: TEMPLATE_PATH,
      },
    ),
    ...packages.map(packageOptions => {
      const {name, resolvedDir} = packageOptions;

      return handlebars(
        Path.join(resolvedDir, 'README.md'),
        {
          name,
          badges: buildBadges(options, packageOptions),
          ...data,
        },
        {
          template: TEMPLATE_PATH,
        },
      );
    }),
  ];
});

type Badge = {
  title: string;
  image: string;
  url: string;
};

function buildBadges(
  {
    name,
    license,
    repository,
    packagesDir,
    badges: {
      npm: npmBadge = false,
      repo: repoBadge = false,
      coverage: coverageBadge = false,
      license: licenseBadge = false,
      discord: discordBadgeHref,
    } = {},
  }: ResolvedOptions,
  packageOptions: ResolvedPackageOptions | undefined,
): Badge[] {
  const badges: Badge[] = [];

  const npmPackageName =
    packagesDir === undefined ? name : packageOptions?.name;

  if (npmBadge && npmPackageName !== undefined) {
    badges.push({
      title: 'NPM version',
      image: `https://img.shields.io/npm/v/${npmPackageName}?color=%23cb3837&style=flat-square`,
      url: `https://www.npmjs.com/package/${npmPackageName}`,
    });
  }

  if (repoBadge) {
    if (packagesDir !== undefined) {
      throw new Error('Badge `repo` is not supported in monorepo.');
    }

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

  if (typeof discordBadgeHref === 'string') {
    badges.push({
      title: 'Discord',
      image:
        'https://img.shields.io/badge/chat-discord-5662f6?style=flat-square',
      url: discordBadgeHref,
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
