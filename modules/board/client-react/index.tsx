import React from 'react';

import ClientModule from '@gqlapp/module-client-react';
import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import loadable from '@loadable/component';

import { Route, NavLink } from 'react-router-dom';
import { MenuItem } from '@gqlapp/look-client-react';
import resources from './locales';
//@ts-ignore
import {AuthRoute} from '@gqlapp/user-client-react/containers/Auth';
const NavLinkWithI18n = translate('board')(({ t }: { t: TranslateFunction }) => (
  <NavLink to="/" className="nav-link" activeClassName="active">
    {t('board:navLink')}
  </NavLink>
));

export default new ClientModule({
  route: [
    <Route  exact path="/" component={loadable(() => import('./containers/Board').then((c) => c.default))} />,
    <AuthRoute  exact path="/board/new" component={loadable(() => import('./containers/AddBoard').then((c) => c.default))} />,
    <AuthRoute  exact path="/board/:id" component={loadable(() => import('./containers/GameBoard').then((c) => c.default))} />,
  ],
  navItem: [
    <MenuItem key="/">
      <NavLinkWithI18n />
    </MenuItem>,
  ],
  localization: [{ ns: 'board', resources }],
});
