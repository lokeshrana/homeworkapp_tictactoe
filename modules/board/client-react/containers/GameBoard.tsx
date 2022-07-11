import React from "react";

import { translate, TranslateFunction } from "@gqlapp/i18n-client-react";
import GameBoardsView from "../components/GameBoardView";
//@ts-ignore
import { withLoadedUser } from "@gqlapp/user-client-react/containers/AuthBase";
import { withBoard, withCurrentUser } from "./BoardsOperations";
import { compose } from "@gqlapp/core-common";
import { graphql, withApollo } from "react-apollo";
import MAKE_MOVE from "../graphql/MakeMove.graphql";
import {subscribeToBoard} from "./BoardSubscriptions";
interface GameBoardsProps {
  t: TranslateFunction;
}

const GameBoards = (props: any) => {
  const { makeMove, subscribeToMore, board, location, history } = props;
  console.log("🚀 ~ file: GameBoard.tsx ~ line 18 ~ GameBoards ~ props", board)
  React.useEffect(() => {
    const subscribe = board && subscribeToBoard(subscribeToMore, board && board.id, history);
    return () => {
      () => subscribe();
    };
  }, [history, subscribeToMore, board, location]);

  const handleMove = async (row: number, col: number) => {

    try {
      const updatedBoard = await makeMove({
        boardId: props.board?.id,
        positionX: col,
        positionY: row,
      });
      
    } catch (e) {
      throw new Error("Make Move error", e.message);
    }
  };
  return props.loading || !props.board ? (
    "Loading ..."
  ) : (
    <GameBoardsView {...props}  handleMove={handleMove} />
  );
};

export default compose(
  withCurrentUser,
  withBoard,
  withApollo,
  graphql(MAKE_MOVE, {
    props: ({ mutate }) => ({
      makeMove: async ({ boardId, positionX, positionY }: any) => {
        const {
          //@ts-ignore
          data: { makeMove },
        } = await mutate({
          variables: { input: { boardId, positionX, positionY } },
        });
        return makeMove;
      },
    }),
  }),
  translate("listing")
)(GameBoards);
