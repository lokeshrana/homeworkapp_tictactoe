import React from "react";
import Helmet from "react-helmet";
import { Link } from "react-router-dom";
import {
  PageLayout,
  Button,
  Card,
  CardText,
  CardTitle,
} from "@gqlapp/look-client-react";
import { Plus } from "react-bootstrap-icons";
import {
  CrossSymbol,
  getIfCurrentUser1,
  getOtherUserFullNameFromBoard,
  ZeroSymbol,
} from "./utils";
const NoBoardFoundComponent = () => {
  return (
    <div className="no-boards-wrapper">
      <h1>No Games</h1>
      <h1>Found</h1>
      <Link to="/board/new">
        <Button>Start a new game</Button>
      </Link>
    </div>
  );
};

const getIfYourMove = (board: any, isCurrentUser1: boolean) => {
  if (board.winnerId) {
    return false;
  }
  if (isCurrentUser1) {
    return board?.moves?.length % 2 === 0;
  } else {
    return board?.moves?.length % 2 === 1;
  }
};

const GameBoardsView = (props: any) => {
  const [boardLoading, setBoardLoading] = React.useState(false);

  const { t, currentUser, board, loading, handleMove } = props;
  const handleMakeMove = async (row: number, col: number) => {
    setBoardLoading(true);
    await handleMove(row, col);
    setBoardLoading(false);
  };
  console.log(
    "🚀 ~ file: GameBoardView.tsx ~ line 74 ~ GameBoardsView ~ board",
    board
  );
  const otherUserName = getOtherUserFullNameFromBoard(board, currentUser.id);
  const isCurrentUser1 = getIfCurrentUser1(board, currentUser.id);
  let winStatement = "";
  const isCurrentUserWinner = currentUser?.id === board?.winnerId;
  if (board.winnerId) {
    if (isCurrentUserWinner) {
      winStatement = "You won!";
    } else {
      winStatement = `${otherUserName} won!`;
    }
  }
  const isYourMove = getIfYourMove(board, isCurrentUser1);
  const getBoxSymbol = (row: number, col: number) => {
    const move = board?.moves?.find(
      (m: any) => m.positionY === row && m.positionX === col
    );
    if (move) {
      if (isCurrentUser1) {
        return move.userId === currentUser.id ? (
          <CrossSymbol />
        ) : (
          <ZeroSymbol />
        );
      } else {
        return move.userId === currentUser.id ? (
          <ZeroSymbol />
        ) : (
          <CrossSymbol />
        );
      }
    }
    return "";
  };

  return (
    <PageLayout gridRows="1fr 60px">
      <div>
        <h2>{`Game with ${otherUserName}`}</h2>
        <p>Your piece</p>
        {isCurrentUser1 ? <CrossSymbol /> : <ZeroSymbol />}
        <br />
        <div className="game-board-container">
          <div className="game-board-title">
            {isYourMove
              ? "Your move"
              : winStatement === ""
              ? "Opponent's move"
              : winStatement}
          </div>
          <div
            className="game-board-game"
            style={{
              pointerEvents:
                boardLoading || !isYourMove || board.winnerId
                  ? "none"
                  : "unset",
            }}
          >
            {Array.from(Array(3).keys()).map((row: number) => {
              return (
                <>
                  {Array.from(Array(3).keys()).map((col: number) => {
                    const boxSymbol = getBoxSymbol(row, col);
                    return (
                      <div
                        onClick={() => handleMakeMove(row, col)}
                        className="game-board-piece"
                      >
                        {boxSymbol}
                      </div>
                    );
                  })}
                </>
              );
            })}
          </div>
        </div>
      </div>
      {winStatement === "" && (<Button>Submit</Button>)}
    </PageLayout>
  );
};

// {emptyBoards ? (
//   <NoBoardFoundComponent />
// ) : (
//   <>
//   {/* <Link to="/board/new">
//     <div className="add-more-button">
//       <Plus /> Add More
//     </div>
//   </Link> */}
//     {boards?.edges?.map((board: any) => {

//       return (
//         //@ts-ignore
//         <Card style={{ width: "100%", padding: "16px" }}>
//           <h2>{`Game with ${otherUserName}`}</h2>
//           <CardText>{boardCartDescriptionStatement}</CardText>
//           <Link to={`/board/${board.id}`}>
//             <Button>View Game!</Button>
//           </Link>
//         </Card>
//         // <h1>sldfjlsjf</h1>
//       );
//     })}
//   </>
// )}

export default GameBoardsView;
