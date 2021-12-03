import React from "react";
import style from "../styles/SideNav.module.scss";
import { useActions, useTypedSelector } from "../app/hooks";

const Category = ({ children, icon }: { children: string; icon: string }) => {
  const { ShowProfileAction } = useActions();
  const click = () => ShowProfileAction();
  const showProfile = useTypedSelector((state) => state.appReducer.showProfile);

  return (
    <button onClick={click} className={`${style.category} ${showProfile && `${style.categoryActive}`}`}>
      <img alt={"Profile"} src={icon}></img>
      {children}
    </button>
  );
};

export default Category;
