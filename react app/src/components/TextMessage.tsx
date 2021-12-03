import React, { useState, useRef } from "react";
import { message, chat } from "../app/chatReducer/chatReducer";
import contextMenuWhiteImage from "../images/contextMenuWhite.svg";
import axios, { baseURL } from "../config/axiosInstance";
import { useActions } from "../app/hooks";
import style from "../styles/ChatMessages.module.scss";

const prepareDateString = (date: Date) => {
  let stringDate;
  stringDate = `${date.getHours()}:${date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`}`;
  return stringDate;
};

const TextMessage = ({ message, chat }: { message: message; chat: chat }) => {
  const { date } = message;
  const { id } = chat;
  const messageDiv = useRef<HTMLDivElement>(null);
  const dropDownMenu = useRef<HTMLUListElement>(null);
  const [showMenu, setShowMenu] = useState(false);
  window.addEventListener("click", (e: MouseEvent) => setShowMenu(false));
  const { ShowProfileAction, SetAnotherUserProfileAction } = useActions();
  if (message.received) {
    return (
      <div className={style.receivedMessage}>
        <div
          onClick={() => {
            SetAnotherUserProfileAction(true, chat.username, chat.id);
            ShowProfileAction();
          }}
          className={style.messageHeader}
        >
          <img alt="User avatar" src={`${baseURL}avatar/${chat.id}/`}></img>
          {chat.username}
        </div>
        <div className={style.messageText}>
          {message.text}
          <div className={style.messageFooter}>{prepareDateString(new Date(Date.parse(message.date)))}</div>
        </div>
      </div>
    );
  } else
    return (
      <div className={style.sentMessage}>
        <div className={style.sentMessageText}>
          {message.text}
          <div className={style.messageFooter}>
            {prepareDateString(new Date(Date.parse(message.date)))}
            <div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  messageDiv.current && messageDiv.current.click();
                  setShowMenu(!showMenu);
                }}
              >
                <img alt="Context menu" src={contextMenuWhiteImage}></img>
              </button>
              {showMenu && (
                <ul ref={dropDownMenu}>
                  <li className={style.singleButton}>
                    <button onClick={() => axios.delete("deleteMessage", { headers: { access_token: localStorage.getItem("access_token"), Receiver: id, time: date } })}>Remove message</button>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    );
};

export default TextMessage;
