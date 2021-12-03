import React from "react";
import style from "../styles/Header.module.scss";
import notificationsImage from "../images/notification.svg";
import notificationsOffImage from "../images/notificationOff.svg";
import exitImage from "../images/exit.svg";
import { useActions, useTypedSelector } from "../app/hooks";
import { baseURL } from "../config/axiosInstance";

const Header = () => {
  const { DeauthAction, ShowProfileAction, ToggleNotificationsAction, NewChatSearchQueryAction } = useActions();
  const email = useTypedSelector((state) => state.appReducer.email);
  const refreshAvatar = useTypedSelector((state) => state.appReducer.refreshAvatar);
  const notifications = useTypedSelector((state) => state.appReducer.notifications);
  const chatSearchQuery = useTypedSelector((state) => state.chatReducer.chatSearchQuery);
  return (
    <header>
      <input onChange={(e) => NewChatSearchQueryAction(e.target.value)} value={chatSearchQuery} placeholder="Search"></input>
      <div className={style.headerRight}>
        <div className={style.headerButtons}>
          <button onClick={() => ToggleNotificationsAction()} className={style.headerNotifications}>
            {notifications ? <img alt="Notifications" src={notificationsImage}></img> : <img alt="Notifications" src={notificationsOffImage}></img>}
          </button>
        </div>
        <div className={style.headerProfile}>
          <button
            onClick={() => {
              localStorage.removeItem("access_token");
              DeauthAction();
            }}
            className={style.headerExit}
          >
            <img alt="Exit" src={exitImage}></img>
          </button>
          <button onClick={() => ShowProfileAction()} className={style.headerAvatar}>
            {email && <img alt="Avatar" src={`${baseURL}avatar/${email}/${refreshAvatar}`}></img>}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
