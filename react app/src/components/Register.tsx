import React from "react";
import style from "../styles/Login.module.scss";
import RegisterForm from "./RegisterForm";

const Register = () => {
  return (
    <div className={style.loginWrapper}>
      <div className={style.login}>
        <div className={style.title}>REGISTER</div>
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
