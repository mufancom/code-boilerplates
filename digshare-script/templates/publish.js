#!/usr/bin/node

const {exec} = require('child_process');

let [mode] = process.argv.slice(2);

let config;

try {
  // @ts-ignore
  let configs = require('./.config');
  config = mode !== undefined ? configs[mode] : configs;
} catch {
  console.warn(
    '\x1B[33m%s\x1B[0m',
    'Not found `.config.js`. If it is deliberate, please ignore',
  );
}

let env = {
  ...config,
  ...process.env,
};

for (let key of ['DIGSHARE_API', 'DIGSHARE_REGISTRY']) {
  if (env[key]) {
    continue;
  }

  throw Error(`\`${key}\` is required`);
}

const {DIGSHARE_API, DIGSHARE_REGISTRY} = env;

console.log('Using config:', {
  DIGSHARE_API,
  DIGSHARE_REGISTRY,
});

let child = exec(
  `node ./node_modules/lerna/cli publish patch --registry=${DIGSHARE_REGISTRY}`,
  {
    env: {
      ...env,
      ...process.env,
    },
  },
);

child.on('exit', code => process.exit(code ?? 0));

process.stdin.pipe(child.stdin);

child.stdout.pipe(process.stdout);
child.stderr.pipe(process.stderr);
