import React from "react";

import { translate, TranslateFunction } from "@gqlapp/i18n-client-react";
import MyBoardsView from "../components/MyBoardsView";
//@ts-ignore
import {withLoadedUser} from '@gqlapp/user-client-react/containers/AuthBase'
import {
  withBoards,
  withCurrentUser
} from './BoardsOperations';
import { compose } from "@gqlapp/core-common";

interface MyBoardsProps {
  t: TranslateFunction;
}

const MyBoards = (props:any) => {
console.log("🚀 ~ file: MyBoards.tsx ~ line 18 ~ MyBoards ~ props", props)
  return <MyBoardsView {...props} />;
};

export default compose(
  withCurrentUser,
  withBoards,
  translate('listing')
)(MyBoards);;
