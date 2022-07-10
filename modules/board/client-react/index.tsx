import React from 'react';

import ClientModule from '@gqlapp/module-client-react';
import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import loadable from '@loadable/component';

import { Route, NavLink } from 'react-router-dom';
import { MenuItem } from '@gqlapp/look-client-react';
import resources from './locales';

const NavLinkWithI18n = translate('board')(({ t }: { t: TranslateFunction }) => (
  <NavLink to="/board" className="nav-link" activeClassName="active">
    {t('board:navLink')}
  </NavLink>
));

export default new ClientModule({
  route: [
    <Route exact path="/board" component={loadable(() => import('./containers/Board').then((c) => c.default))} />,
  ],
  navItem: [
    <MenuItem key="/board">
      <NavLinkWithI18n />
    </MenuItem>,
  ],
  localization: [{ ns: 'board', resources }],
});
