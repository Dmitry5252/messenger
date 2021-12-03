import React, { useState, useRef } from "react";
import { message, chat } from "../app/chatReducer/chatReducer";
import fileImage from "../images/file.svg";
import fileWhiteImage from "../images/fileWhite.svg";
import contextMenuImage from "../images/contextMenu.svg";
import contextMenuWhiteImage from "../images/contextMenuWhite.svg";
import { baseURL } from "../config/axiosInstance";
import style from "../styles/ChatMessages.module.scss";
import axios from "../config/axiosInstance";

const prepareFileNameString = (name: string) => {
  if (name.length > 54) return `${name.slice(0, 54)}...`;
  else return name;
};

const prepareDateString = (date: Date) => {
  let stringDate;
  stringDate = `${date.getHours()}:${date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`}`;
  return stringDate;
};

const FileMessage = ({ message, chat }: { message: message; chat: chat }) => {
  const { src, fileName, date } = message;
  const { id } = chat;
  const messageDiv = useRef<HTMLDivElement>(null);
  const dropDownMenu = useRef<HTMLUListElement>(null);
  const [showMenu, setShowMenu] = useState(false);
  window.addEventListener("click", (e: MouseEvent) => setShowMenu(false));
  if (message.received) {
    return (
      <div ref={messageDiv} className={style.receivedFileMessage}>
        <div className={style.fileWrapper}>
          <a href={`${baseURL}getFile/${src}/${fileName}`}>
            <img className={style.documentIcon} alt="Received message" src={fileImage} />
          </a>
          <div className={style.fileInfo}>
            <a href={`${baseURL}getFile/${src}/${fileName}`}>{prepareFileNameString(message.fileName)}</a>
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
                  <img alt="Context menu" src={contextMenuImage}></img>
                </button>
                {showMenu && (
                  <ul ref={dropDownMenu}>
                    <li className={style.singleButton}>
                      <a href={`${baseURL}getFile/${src}/${fileName}`}>Download file</a>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div ref={messageDiv} className={style.sentFileMessage}>
        <div className={style.fileWrapper}>
          <a href={`${baseURL}getFile/${src}/${fileName}`}>
            <img className={style.documentIcon} alt="Sent message" src={fileWhiteImage} />
          </a>
          <div className={style.fileInfo}>
            <a href={`${baseURL}getFile/${src}/${fileName}`}>{prepareFileNameString(message.fileName)}</a>
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
                      <a href={`${baseURL}getFile/${src}/${fileName}`}>Download file</a>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default FileMessage;
