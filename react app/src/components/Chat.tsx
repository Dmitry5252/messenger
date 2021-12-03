import React from "react";
import style from "../styles/Chats.module.scss";
import { useActions, useTypedSelector } from "../app/hooks";
import { chat } from "../app/chatReducer/chatReducer";
import { baseURL } from "../config/axiosInstance";

const prepareDateString = (date: Date) => {
  let stringDate;
  if (+new Date() - +date > 31536000000) {
    stringDate = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
    return stringDate;
  }
  if (+new Date() - +date > 86400000) {
    stringDate = `${date.getDate()}.${date.getMonth() + 1}`;
    return stringDate;
  }
  stringDate = `${date.getHours()}:${date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`}`;
  return stringDate;
};

const Chat = ({ chat, index }: { chat: chat; index: number }) => {
  const { ChooseChatAction } = useActions();
  const chosenChat = useTypedSelector((state) => state.chatReducer.chosenChat);
  let text;
  if (chat.messages[0]) {
    if (chat.messages[chat.messages.length - 1].text.length > 26) {
      text = `${chat.messages[chat.messages.length - 1].text.slice(0, 26)}...`;
    } else {
      text = chat.messages[chat.messages.length - 1].text;
    }
  }
  let stringDate;
  if (chat.messages[0]) {
    let date = new Date(Date.parse(chat.messages[chat.messages.length - 1].date));
    stringDate = prepareDateString(date);
  }
  return (
    <div onClick={() => ChooseChatAction(index)} className={`${style.chatCard} ${chosenChat === index ? style.chatCardActive : " "}`}>
      <img alt="User avatar" src={`${baseURL}avatar/${chat.id}/`} />
      <div className={style.chatPreview}>
        <div className={style.username}>{chat.username}</div>
        <div className={style.chatTextPreview}>{text}</div>
      </div>
      <div className={style.date}>{stringDate}</div>
    </div>
  );
};

export default Chat;
