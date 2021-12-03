import React from "react";
import style from "../styles/SideNav.module.scss";
import Category from "./Category";
import createImage from "../images/create.svg";
import profileImage from "../images/profile.svg";
import { useActions } from "../app/hooks";

const SideNav = () => {
  const { StartNewChatAction } = useActions();
  return (
    <div className={style.sideNav}>
      <button onClick={() => StartNewChatAction()} className={style.mainButton}>
        <img alt="New chat" src={createImage} />
        Create New
      </button>
      <div className={style.categories}>
        <Category icon={profileImage}>Your Profile</Category>
      </div>
    </div>
  );
};
export default SideNav;
