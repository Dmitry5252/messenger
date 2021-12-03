import React from "react";
import { useActions } from "../app/hooks";
import axios from "../config/axiosInstance";
import loginProfileImage from "../images/loginProfile.svg";
import lockImage from "../images/lock.svg";
import emailImage from "../images/email.svg";
import style from "../styles/Login.module.scss";
import { FORM_ERROR } from "final-form";
import { Form, Field } from "react-final-form";
import { required, email, minLength, maxLength, composeValidators } from "../utils/validators";

const RegisterForm = () => {
  const { AuthAction, ToLoginAction } = useActions();
  const sendLoginRequest = ({ email, username, password }: { email: string; username: string; password: string }) => {
    return axios.post("register", { email, username, password }).then(
      (value) => {
        localStorage.setItem("access_token", value.data.access_token);
        AuthAction(value.data.username, value.data.email, value.data.id);
      },
      (value) => {
        if (value.response.data === "Email already used") return { email: "Email already used" };
        return { [FORM_ERROR]: "Invalid email or password" };
      }
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
                <div className={style.validationNotice}>{meta.touched && (meta.error || meta.submitError)}</div>
              </div>
            )}
          </Field>
          <Field validate={composeValidators(required, minLength, maxLength)} name="username">
            {({ meta, input }) => (
              <div>
                <div className={style.inputWrapper}>
                  <img alt="Username" src={loginProfileImage} />
                  <input {...input} placeholder="Username" />
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
            Sign Up
          </button>
          <div className={style.registerNotice}>
            Already have an account?
            <button onClick={() => ToLoginAction()}>Sign In</button>
          </div>
        </form>
      )}
    ></Form>
  );
};

export default RegisterForm;
