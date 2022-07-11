import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import { Container } from "reactstrap";
import { ChevronLeft } from "react-bootstrap-icons";
import settings from "@gqlapp/config";
import { useHistory, Link  } from "react-router-dom";

import NavBar from "./NavBar";
import styles from "../styles/styles.scss";

const footerHeight = "40px";

const Footer = styled.footer`
  margin-top: 10px;
  line-height: ${footerHeight};
  height: ${footerHeight};
`;

const PageLayout = (props) => {
  const { children, navBar, gridRows } = props;
  const history = useHistory();
  const path = history.location.pathname;
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        padding: path === "/" ? "16px" : "100px 16px 16px 16px",
        display: "grid",
        gap: "22px",
        gridTemplateRows: gridRows || "auto",
        position: "relative",
      }}
    >
      {path !== "/" && (
        <div
          style={{
            position: "absolute",
            left: "16px",
            top: "22px",
            height: "fit-content",
            width: "fit-content",
          }}
        >
          <Link to='/'>
           <ChevronLeft size={25} color='black' />
          </Link>
        </div>
      )}
      {children}
    </div>
    // <section className="d-flex flex-column flex-grow-1">
    //   {__SERVER__ && __DEV__ && (
    //     <Helmet>
    //       <style type="text/css">{styles._getCss()}</style>
    //     </Helmet>
    //   )}
    //   <section className="d-flex flex-column flex-grow-1 flex-shrink-0">
    //     <section className="d-flex flex-column no-print">{navBar !== false && <NavBar />}</section>
    //     <Container id="content">{children}</Container>
    //   </section>
    //   <Footer className="d-flex flex-shrink-0 justify-content-center no-print">
    //     <span>
    //       &copy; {new Date().getFullYear()}. {settings.app.name}.
    //     </span>
    //   </Footer>
    // </section>
  );
};

PageLayout.propTypes = {
  children: PropTypes.node,
  navBar: PropTypes.bool,
};

export default PageLayout;
