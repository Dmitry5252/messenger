import React, { useState, useRef, UIEventHandler, useEffect } from "react";
import { chat } from "../app/chatReducer/chatReducer";
import style from "../styles/ChatMessages.module.scss";
import arrowImage from "../images/arrow.svg";
import { useTypedSelector } from "../app/hooks";
import FileMessage from "./FileMessage";
import ImageMessage from "./ImageMessage";
import TextMessage from "./TextMessage";

const ChatMessages = ({ chat }: { chat: chat }) => {
  const chats = useTypedSelector((state) => state.chatReducer.chats);
  const chosenChat = useTypedSelector((state) => state.chatReducer.chosenChat);

  const messagesBottom = useRef<HTMLDivElement>(null);
  const chatMessages = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesBottom && messagesBottom.current && messagesBottom.current.scrollIntoView();
  }, [chats, chosenChat]);

  const showButton: UIEventHandler = (e) => {
    if (chatMessages && chatMessages.current && chatMessages.current.scrollHeight - chatMessages.current.scrollTop > 1200) setShowScrollButton(true);
    else setShowScrollButton(false);
  };

  const [showScrollButton, setShowScrollButton] = useState(false);

  return (
    <div className={style.chatMessagesWrapper}>
      <div onScroll={showButton} ref={chatMessages} className={style.chatMessages}>
        <div>
          {chat &&
            chat.messages.map((message) => {
              if (message.type === "file") return <FileMessage key={message.date.toString()} message={message} chat={chat} />;
              else if (message.type === "image") return <ImageMessage key={message.date.toString()} message={message} chat={chat} />;
              else return <TextMessage key={message.date.toString()} message={message} chat={chat} />;
            })}
        </div>
        {showScrollButton && (
          <button onClick={(e) => messagesBottom && messagesBottom.current && messagesBottom.current.scrollIntoView()} className={style.scrollButton}>
            <img alt="Scroll to bottom" src={arrowImage}></img>
          </button>
        )}
        <div ref={messagesBottom}></div>
      </div>
    </div>
  );
};

export default ChatMessages;
