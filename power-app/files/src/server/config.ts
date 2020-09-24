import {config as dotenvConfig} from 'dotenv-flow';

export interface MongoConfig {
  uri: string;
  name: string;
}

export type Config = DevConfig | ProductionConfig;

interface BasicConfig {
  /**
   * PowerApp Name
   */
  name: string;
  port: number;
  mongo: MongoConfig;
}

export interface DevConfig extends BasicConfig {
  production: false;
  client: {
    port: number;
  };
}

export interface ProductionConfig extends BasicConfig {
  production: true;
  client: {
    host: string;
  };
}

export function getConfig(): Config {
  dotenvConfig({
    default_node_env: 'development',
  });

  const {
    APP_NAME,
    HOST,
    CLIENT_PORT,
    SERVER_PORT,
    MONGO_URI,
    MONGO_NAME,
    NODE_ENV,
  } = process.env;

  const name = APP_NAME!;
  const production = NODE_ENV === 'production';

  let basic: BasicConfig = {
    name,
    port: +SERVER_PORT!,
    mongo: {
      uri: MONGO_URI!,
      name: MONGO_NAME!,
    },
  };

  return production
    ? {
        production,
        client: {
          host: HOST!,
        },
        ...basic,
      }
    : {
        production,
        client: {
          port: +CLIENT_PORT!,
        },
        ...basic,
      };
}
