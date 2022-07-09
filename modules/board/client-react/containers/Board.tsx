import React from 'react';

import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import BoardView from '../components/BoardView';

interface BoardProps {
  t: TranslateFunction;
}

class Board extends React.Component<BoardProps> {
  public render() {
    return <BoardView {...this.props} />;
  }
}

export default translate('board')(Board);
