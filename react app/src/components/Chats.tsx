import React from "react";
import style from "../styles/Chats.module.scss";
import { useActions, useTypedSelector } from "../app/hooks";
import Chat from "./Chat";
import createImage from "../images/create.svg";
import ChatMessages from "./ChatMessages";
import ChatInputs from "./ChatInputs";
import { baseURL } from "../config/axiosInstance";

const Chats = () => {
  const { ShowProfileAction, SetAnotherUserProfileAction, StartNewChatAction } = useActions();
  const chats = useTypedSelector((state) => state.chatReducer.chats);
  const chosenChat = useTypedSelector((state) => state.chatReducer.chosenChat);
  const chatSearchQuery = useTypedSelector((state) => state.chatReducer.chatSearchQuery);
  return (
    <div style={style} className={style.chats}>
      <div className={style.chatWrapper}>
        <div className={style.chatList}>
          <div className={style.chatListInner}>{chats.map((item, index) => item.username.toLowerCase().includes(chatSearchQuery.toLowerCase()) && <Chat key={item.id} chat={item} index={index} />)}</div>
          <button onClick={() => StartNewChatAction()} className={style.mobileNewChat}>
            <img alt="New chat" src={createImage} />
          </button>
        </div>
        <div className={style.chat}>
          {chosenChat != null && chats[chosenChat] && (
            <div className={style.chatHeader}>
              <div className={style.leftSpace} />
              <div
                onClick={() => {
                  SetAnotherUserProfileAction(true, chats[chosenChat].username, chats[chosenChat].id);
                  ShowProfileAction();
                }}
                className={style.chatHeaderUsername}
              >
                {chats[chosenChat].username}
              </div>
              <img
                onClick={() => {
                  SetAnotherUserProfileAction(true, chats[chosenChat].username, chats[chosenChat].id);
                  ShowProfileAction();
                }}
                alt="User avatar"
                src={`${baseURL}avatar/${chats[chosenChat].id}/`}
              ></img>
            </div>
          )}
          {chosenChat != null && <ChatMessages chat={chats[chosenChat]} />}
          {chosenChat == null && <div className={style.emptySpace} />}
          {chosenChat != null && <ChatInputs />}
        </div>
      </div>
    </div>
  );
};

export default Chats;
