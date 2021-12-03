import React, { ChangeEventHandler, useRef } from "react";
import style from "../styles/Profile.module.scss";
import { useActions, useTypedSelector } from "../app/hooks";
import axios, { baseURL } from "../config/axiosInstance";

const Profile = () => {
  const name = useTypedSelector((state) => state.appReducer.name);
  const anotherUser = useTypedSelector((state) => state.appReducer.anotherUser);
  const anotherUserName = useTypedSelector((state) => state.appReducer.anotherUserName);
  const anotherUserID = useTypedSelector((state) => state.appReducer.anotherUserID);
  const email = useTypedSelector((state) => state.appReducer.email);
  const refreshAvatar = useTypedSelector((state) => state.appReducer.refreshAvatar);
  const fileUpload = useRef<HTMLInputElement>(null);
  const click = () => {
    fileUpload.current?.click();
  };
  const chats = useTypedSelector((state) => state.chatReducer.chats);
  const toChat = () => {
    ChooseChatAction(chats.findIndex((e) => e.id === anotherUserID));
    ShowProfileAction();
    SetAnotherUserProfileAction(false);
  };
  const sendAvatar: ChangeEventHandler<HTMLInputElement> = (e) => {
    const image = new FormData();
    if (e.target.files) {
      image.append("avatar", e.target.files[0]);
    }
    axios.post("setAvatar", image, { headers: { access_token: localStorage.getItem("access_token"), "Content-Type": "multipart/form-data" } }).then((r) => RefreshAvatarAction());
  };
  const { ShowProfileAction, ChooseChatAction, RefreshAvatarAction, SetAnotherUserProfileAction } = useActions();
  return (
    <div
      onClick={(e) => {
        ShowProfileAction();
        SetAnotherUserProfileAction(false);
      }}
      className={style.profileWrapper}
    >
      <div onClick={(e) => e.stopPropagation()} className={style.profile}>
        <div className={style.avatarWrapper}>
          <img alt="Avatar" className={style.avatar} src={`${baseURL}avatar/${anotherUser ? anotherUserID : email}/${refreshAvatar}`}></img>
          <div className={style.profileRight}>
            <div className={style.username}>{anotherUser ? anotherUserName : name}</div>
            <button onClick={anotherUser ? toChat : click}>{anotherUser ? "Send message" : "Change avatar"}</button>
            <input accept="image/*" ref={fileUpload} onChange={sendAvatar} type="file" className={style.fileUpload}></input>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
