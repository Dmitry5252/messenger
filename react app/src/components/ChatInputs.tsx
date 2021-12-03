import React, { useState, useRef, FormEvent, ChangeEventHandler } from "react";
import attachImage from "../images/attach.svg";
import attachFileImage from "../images/attachFile.svg";
import sendImage from "../images/send.svg";
import style from "../styles/ChatInputs.module.scss";
import { useTypedSelector } from "../app/hooks";
import axios from "../config/axiosInstance";

const ChatInputs = () => {
  const chats = useTypedSelector((state) => state.chatReducer.chats);
  const chosenChat = useTypedSelector((state) => state.chatReducer.chosenChat);
  const socket = useTypedSelector((state) => state.chatReducer.socket);
  const [message, setMessage] = useState("");
  const imageUpload = useRef<HTMLInputElement>(null);
  const fileUpload = useRef<HTMLInputElement>(null);
  const imageSend: ChangeEventHandler<HTMLInputElement> = (e) => {
    const image = new FormData();
    if (e.target.files) {
      image.append("image", e.target.files[0]);
    }
    if (chosenChat != null) {
      const id = chats[chosenChat].id;
      axios.post("sendImageMessage", image, { headers: { access_token: localStorage.getItem("access_token"), "Content-Type": "multipart/form-data", Receiver: id } });
    }
  };
  const fileSend: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = new FormData();
    if (e.target.files) {
      file.append("file", e.target.files[0]);
    }
    if (chosenChat != null) {
      const id = chats[chosenChat].id;
      axios.post("sendFileMessage", file, { headers: { access_token: localStorage.getItem("access_token"), "Content-Type": "multipart/form-data", Receiver: id } });
    }
  };
  const sendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (message) {
      socket?.send(`${chosenChat != null && chats[chosenChat].id}${message}`);
      setMessage("");
    }
  };
  return (
    <div className={style.chatInputsWrapper}>
      <form onSubmit={sendMessage} className={style.chatInputs}>
        <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write a message" />
        <div className={style.chatInputsButtons}>
          <button type="button" onClick={() => fileUpload.current?.click()} className={style.attachFile}>
            <img alt="Attach" src={attachImage} />
            <input ref={fileUpload} onChange={fileSend} type="file" className={style.fileUpload}></input>
          </button>
          <button type="button" onClick={() => imageUpload.current?.click()} className={style.attachFile}>
            <img alt="Attach file" src={attachFileImage} />
            <input accept="image/*" ref={imageUpload} onChange={imageSend} type="file" className={style.fileUpload}></input>
          </button>
          <button className={style.submitButton} type="submit">
            Send
            <img alt="Send" src={sendImage} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInputs;
