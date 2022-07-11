import React from "react";

import { translate, TranslateFunction } from "@gqlapp/i18n-client-react";
import BoardView from "../components/BoardView";
//@ts-ignore
import {withLoadedUser} from '@gqlapp/user-client-react/containers/AuthBase'
interface BoardProps {
  t: TranslateFunction;
}

const Board = withLoadedUser((props:BoardProps) => {
  return <BoardView {...props} />;
});

export default translate("board")(Board);
