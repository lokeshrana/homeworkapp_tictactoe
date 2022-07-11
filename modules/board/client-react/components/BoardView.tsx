import React from "react";
import Helmet from "react-helmet";
import { Link } from "react-router-dom";
import { PageLayout, Button } from "@gqlapp/look-client-react";
import { TranslateFunction } from "@gqlapp/i18n-client-react";
import settings from "@gqlapp/config";
import MyBoards from "../containers/MyBoards";

interface BoardViewProps {
  t: TranslateFunction;
}

const renderMetaData = (t: TranslateFunction) => (
  <Helmet
    title={`${settings.app.name} - ${t("title")}`}
    meta={[
      { name: "description", content: `${settings.app.name} - ${t("meta")}` },
    ]}
  />
);

const BoardView = (props: any) => {
  const { t, currentUser } = props;
  console.log(
    "🚀 ~ file: BoardView.tsx ~ line 23 ~ BoardView ~ currentUser",
    currentUser
  );
  return (
    <PageLayout gridRows={currentUser ? "auto" : "1fr 60px 60px"}>
      {renderMetaData(t)}
      {currentUser ? (
        <MyBoards currentUser={currentUser} />
      ) : (
        <>
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
          <Link to="/login?redirectBack" style={{ display: "block" }}>
            <Button type="primary">Login</Button>
          </Link>
          <Link to="/register">
            <Button>Register</Button>
          </Link>
        </>
      )}
    </PageLayout>
  );
};

export default BoardView;
