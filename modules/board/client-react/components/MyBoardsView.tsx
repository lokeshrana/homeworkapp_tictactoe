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
import { getBoardCartDescriptionStatement, getIfCurrentUser1, getOtherUserFullNameFromBoard } from "./utils";

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
