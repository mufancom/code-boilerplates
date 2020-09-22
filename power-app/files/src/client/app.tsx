import React, {FC} from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom';

import {About, NoMatch} from './pages';

export const APP: FC = () => {
  return (
    <HashRouter>
      <Switch>
        <Route path="/about" component={About} />
        <Route path="*" component={NoMatch} />
      </Switch>
    </HashRouter>
  );
};
