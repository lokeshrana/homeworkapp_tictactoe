import React from "react";
import PropTypes from "prop-types";
import { withFormik } from "formik";

import { isFormError, FieldAdapter as Field } from "@gqlapp/forms-client-react";
import { translate } from "@gqlapp/i18n-client-react";
import { required, minLength, validate } from "@gqlapp/validation-common-react";
import { Form, RenderField, Alert, Button, PageLayout } from "@gqlapp/look-client-react";

import settings from "@gqlapp/config";

const loginFormSchema = {
  email: [required, minLength(3)],
};

const LoginForm = ({ handleSubmit, submitting, errors, values, t }) => {
console.log("🚀 ~ file: AddBoardView.jsx ~ line 17 ~ LoginForm ~ errors", errors)
  return (
    <PageLayout>
      <Form name="login" className="login-form" onSubmit={handleSubmit}>
        <div className="login-form-content-wrapper">
          <h4>Start a new game</h4>
          <h1>Whom do you want to play with</h1>
          <Field
            name="email"
            component={RenderField}
            type="text"
            label={"Email"}
            placeholder={"Type their email here"}
            value={values.email}
          />
        </div>
        <div className="text-center">
          {errors && errors.errorMsg && (
            <Alert color="error">{errors.errorMsg}</Alert>
          )}
        </div>
        <Button
          size="lg"
          style={{ minWidth: "320px" }}
          color="primary"
          type="submit"
          disabled={submitting}
        >
          Start Game
        </Button>
      </Form>
    </PageLayout>
  );
};

LoginForm.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  errors: PropTypes.object,
  values: PropTypes.object,
  t: PropTypes.func,
};

const LoginFormWithFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: () => ({ email: "" }),

  handleSubmit(values, { setErrors, props: { onSubmit } }) {
    onSubmit(values).catch((e) => {
      console.log("🚀 ~ file: AddBoardView.jsx ~ line 68 ~ handleSubmit ~ e", e)
      setErrors({errorMsg: e});
      // if (isFormError(e)) {
      // } else {
      //   throw e;
      // }
    });
  },
  validate: (values) => validate(values, loginFormSchema),
  displayName: "LoginForm", // helps with React DevTools
});

export default translate("user")(LoginFormWithFormik(LoginForm));
