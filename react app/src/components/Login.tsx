import React from "react";

import style from "../styles/Login.module.scss";
import LoginForm from "./LoginForm";

const Login = () => {
  return (
    <div className={style.loginWrapper}>
      <div className={style.login}>
        <div className={style.title}>LOGIN</div>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
