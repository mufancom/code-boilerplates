import {Version} from '../helpers';

export const V010 = {
  '0.1.0': Version<{
    powerItems: {
      hello: {
        inputs: {name: string};
        storage: {};
      };
    };
  }>({
    contributions: {
      powerItems: {
        hello: {
          activate({inputs}) {
            console.info(`hello ${inputs.name}`);
          },
        },
      },
    },
  }),
};
