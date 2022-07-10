import React from "react";
import PropTypes from "prop-types";
import { Button as RSButton } from "reactstrap";

const Button = ({ children, ...props }) => {
  let style = {};
  if (props.type === "primary") {
    style.background = "#2F80ED";
    style.borderColor = "#2F80ED";
  } else {
    style.background = "#F2C94C";
    style.borderColor = "#F2C94C";
  }
  style.borderRadius = "8px";
  style.boxShadow = "2px 2px 16px rgba(0, 0, 0, 0.16)";
  style.width = "100%";
  style.height = "56px";
  return <RSButton {...props} style={style}>{children}</RSButton>;
};

Button.propTypes = {
  children: PropTypes.node,
};

export default Button;
