import axios, { baseURL } from "../config/axiosInstance";
import React, { useState } from "react";
import { useActions, useTypedSelector } from "../app/hooks";
import style from "../styles/StartNewChat.module.scss";

const StartNewChat = () => {
  const { ChooseChatAction, NewChatAction, StartNewChatAction } = useActions();
  const [users, setUsers] = useState<{ username: string; id: string }[]>([]);
  const [username, setUsername] = useState("");
  const chats = useTypedSelector((state) => state.chatReducer.chats);
  const getUsers = (username: string) => axios.get(`users/${username}`, { headers: { access_token: localStorage.getItem("access_token") } }).then((r) => setUsers(r.data));
  return (
    <div onClick={() => StartNewChatAction()} className={style.startNewChatWrapper}>
      <div onClick={(e) => e.stopPropagation()} className={style.startNewChat}>
        <div className={style.title}>Start new chat</div>
        <input
          onChange={(e) => {
            setUsername(e.target.value);
            getUsers(e.target.value);
          }}
          value={username}
        />
        <div className={style.userList}>
          {users.map((e) => (
            <div
              onClick={() => {
                if (chats.findIndex((chat) => chat.id === e.id) !== -1) {
                  ChooseChatAction(chats.findIndex((chat) => chat.id === e.id));
                  StartNewChatAction();
                } else {
                  NewChatAction(e.username, e.id);
                  StartNewChatAction();
                  ChooseChatAction(0);
                }
              }}
              className={style.userCard}
            >
              <img alt="User avatar" src={`${baseURL}avatar/${e.id}/`} />
              {e.username}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StartNewChat;
