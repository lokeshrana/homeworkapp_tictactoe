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

const getOtherUserFullNameFromBoard = (board: any, currentUserId: number) => {
  const otherUser =
    board?.user1?.id === currentUserId ? board.user2 : board.user1;
  let fullName = "";
  if (otherUser?.profile?.firstName && otherUser?.profile?.lastName) {
    fullName = `${otherUser.profile.firstName} ${otherUser.profile.lastName}`;
  } else if (otherUser?.profile?.firstName && !otherUser?.profile?.lastName) {
    fullName = `${otherUser.profile.firstName}`;
  } else if (!otherUser?.profile?.firstName && otherUser?.profile?.lastName) {
    fullName = `${otherUser.profile.lastName}`;
  } else {
    fullName = "Name not found";
  }
  return fullName;
};

const getIfCurrentUser1 = (board: any, currentUserId: number) => {
  return board?.user1?.id === currentUserId;
};

const getBoardCartDescriptionStatement = (
  board: any,
  opponentFullName: string,
  isCurrentUser1: boolean
) => {
  const moves = board.moves;
  if (board.winnerId) {
    if (board.winnerId === board.user1.id) {
      return isCurrentUser1 ? "You won the game" : `${opponentFullName} won!`;
    } else if (board.winnerId === board.user2.id) {
      return isCurrentUser1 ? `${opponentFullName} won!` : "You won the game";
    }
  } else if (moves?.length === 0) {
    return "You haven't started the game yet";
  } else if (moves?.length % 2 === 0) {
    return isCurrentUser1
      ? `${opponentFullName} just made their move. Its your turn to play now`
      : "You've made your move. Waiting for them.";
  } else if (moves?.length % 2 === 1) {
    return isCurrentUser1
      ? "You've made your move. Waiting for them."
      : `${opponentFullName} just made their move. Its your turn to play now`;
  } else {
    return "Something went wrong";
  }
};

const MyBoardsView = (props: any) => {
  const { t, currentUser, boards, loading } = props;
  const emptyBoards = loading || boards?.edges?.length === 0;
  return (
    <div className="my-boards-wrapper">
      <h3>Your Games</h3>
      {emptyBoards ? (
        <NoBoardFoundComponent />
      ) : (
        <>
        <Link to="/board/new">
          <div className="add-more-button">
            <Plus /> Add More
          </div>
        </Link>
          {boards?.edges?.map((b: any) => {
            const board = b?.node
            const otherUserName = getOtherUserFullNameFromBoard(
              board,
              currentUser.id
              );
              console.log("🚀 ~ file: MyBoardsView.tsx ~ line 90 ~ {boards?.edges?.map ~ board", board)
            const isCurrentUser1 = getIfCurrentUser1(board, currentUser.id);
            const boardCartDescriptionStatement =
              getBoardCartDescriptionStatement(
                board,
                otherUserName,
                isCurrentUser1
              );

            return (
              //@ts-ignore
              <Card style={{ width: "100%", padding: "16px", marginBottom:"16px" }}>
                <h2>{`Game with ${otherUserName}`}</h2>
                <CardText>{boardCartDescriptionStatement}</CardText>
                <Link to={`/board/${board.id}`}>
                  <Button>View Game!</Button>
                </Link>
              </Card>
              // <h1>sldfjlsjf</h1>
            );
          })}
        </>
      )}
      {/* {renderMetaData(t)}
      <div
        className="home-title"
        style={{
          display: "grid",
          alignItems: "center",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <h3>async</h3>
        <h1>tic tac</h1>
        <h1>toe</h1>
      </div>
      <Link to="/login?redirectBack" style={{display:"block"}}>
        <Button type="primary">Login</Button>
      </Link>
      <Link to='/register'>
      <Button>Register</Button>
      </Link> */}
    </div>
  );
};

export default MyBoardsView;
