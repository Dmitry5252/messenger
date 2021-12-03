import React from "react";
import { useActions } from "../app/hooks";
import emailImage from "../images/email.svg";
import lockImage from "../images/lock.svg";
import style from "../styles/Login.module.scss";
import axios from "../config/axiosInstance";
import { FORM_ERROR } from "final-form";
import { Form, Field } from "react-final-form";
import { required, email, minLength, maxLength, composeValidators } from "../utils/validators";

const LoginForm = () => {
  const { AuthAction, ToRegisterAction } = useActions();
  const sendLoginRequest = ({ email, password }: { email: string; password: string }) => {
    return axios.post("login", { email, password }).then(
      (value) => {
        localStorage.setItem("access_token", value.data.access_token);
        AuthAction(value.data.username, value.data.email, value.data.id);
      },
      (e) => ({ [FORM_ERROR]: "Invalid email or password" })
    );
  };
  return (
    <Form
      onSubmit={sendLoginRequest}
      render={({ handleSubmit, submitError }) => (
        <form onSubmit={handleSubmit} className={style.inputsWrapper}>
          <Field validate={composeValidators(required, email)} name="email">
            {({ meta, input }) => (
              <div>
                <div className={style.inputWrapper}>
                  <img alt="Email" src={emailImage} />
                  <input {...input} placeholder="E-mail" />
                </div>
                <div className={style.validationNotice}>{meta.touched && meta.error}</div>
              </div>
            )}
          </Field>
          <Field validate={composeValidators(required, minLength, maxLength)} name="password" component="input">
            {({ meta, input }) => (
              <div>
                <div className={style.inputWrapper}>
                  <img alt="Password" src={lockImage} />
                  <input {...input} type="password" placeholder="Password" />
                </div>{" "}
                <div className={style.validationNotice}>{meta.touched && meta.error}</div>
              </div>
            )}
          </Field>
          {submitError && <div className={style.mistake}>{submitError}</div>}
          <button className={style.submitButton} type="submit">
            Sign In
          </button>
          <div className={style.registerNotice}>
            Need an account?
            <button onClick={() => ToRegisterAction()}>Sign Up</button>
          </div>
        </form>
      )}
    ></Form>
  );
};

export default LoginForm;
