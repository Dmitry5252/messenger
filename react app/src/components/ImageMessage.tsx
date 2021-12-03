import React, { useRef, useState } from "react";
import { chat, message } from "../app/chatReducer/chatReducer";
import contextMenuImage from "../images/contextMenu.svg";
import contextMenuWhiteImage from "../images/contextMenuWhite.svg";
import { baseURL } from "../config/axiosInstance";
import style from "../styles/ChatMessages.module.scss";
import { useActions } from "../app/hooks";
import axios from "../config/axiosInstance";

const prepareDateString = (date: Date) => {
  let stringDate;
  stringDate = `${date.getHours()}:${date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`}`;
  return stringDate;
};

const ImageMessage = ({ message, chat }: { message: message; chat: chat }) => {
  const { src, fileName, date } = message;
  const { id } = chat;
  const messageDiv = useRef<HTMLDivElement>(null);
  const dropDownMenu = useRef<HTMLUListElement>(null);
  const [showMenu, setShowMenu] = useState(false);
  const { ShowImageAction } = useActions();
  window.addEventListener("click", (e: MouseEvent) => setShowMenu(false));
  if (message.received) {
    return (
      <div ref={messageDiv} className={style.receivedImageMessage}>
        <div className={style.imageWrapper}>
          <img onClick={() => ShowImageAction(message.fileName, message.src)} alt="Received message" src={`${baseURL}getImage/${message.src}/${message.fileName}`} />{" "}
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
                <img alt="Context menu" src={contextMenuImage}></img>{" "}
              </button>
              {showMenu && (
                <ul ref={dropDownMenu}>
                  <li className={style.singleButton}>
                    <a href={`${baseURL}getImage/${src}/${fileName}`}>Download image</a>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div ref={messageDiv} className={style.sentImageMessage}>
        <div className={style.imageWrapper}>
          <img onClick={() => ShowImageAction(message.fileName, message.src)} alt="Sent message" src={`${baseURL}getImage/${message.src}/${message.fileName}`} />
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
                  <li className={style.topButton}>
                    <button onClick={() => axios.delete("deleteMessage", { headers: { access_token: localStorage.getItem("access_token"), Receiver: id, time: date } })}>Remove message</button>
                  </li>
                  <li className={style.bottomButton}>
                    <a href={`${baseURL}getImage/${src}/${fileName}`}>Download image</a>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default ImageMessage;
