import fs from "fs";

import MongoDb from "../db";

import User from "./user";

interface Message {
  text: string;
  sender: 1 | 2;
  date: Date;
  type: string;
  fileName: null | string;
  src: null | string;
}

interface Chat {
  user1: User;
  user2: User;
  messages: Message[];
}

class Chat {
  constructor(user1: User, user2: User, messages = []) {
    this.user1 = user1;
    this.user2 = user2;
    this.messages = messages;
  }

  save = async () => {
    await MongoDb.then((client) => client.db("messenger").collection("chats").insertOne({ user1: this.user1._id, user2: this.user2._id, messages: this.messages }));
  };

  addMessage = async (text: string, senderValue: User) => {
    const sender = this.user1._id.toString() == senderValue._id.toString() ? 1 : 2;
    this.messages.push({ text, sender, date: new Date(), type: "text", fileName: null, src: null });

    await MongoDb.then((client) =>
      client
        .db("messenger")
        .collection("chats")
        .updateOne({ user1: this.user1._id, user2: this.user2._id }, { $set: { messages: this.messages } })
    );
  };

  addImageMessage = async (fileName: string, src: string, senderValue: User) => {
    const sender = this.user1._id.toString() == senderValue._id.toString() ? 1 : 2;
    this.messages.push({ text: "", sender, date: new Date(), type: "image", fileName, src });

    await MongoDb.then((client) =>
      client
        .db("messenger")
        .collection("chats")
        .updateOne({ user1: this.user1._id, user2: this.user2._id }, { $set: { messages: this.messages } })
    );
  };

  addFileMessage = async (fileName: string, src: string, senderValue: User) => {
    const sender = this.user1._id.toString() == senderValue._id.toString() ? 1 : 2;
    this.messages.push({ text: "", sender, date: new Date(), type: "file", fileName, src });

    await MongoDb.then((client) =>
      client
        .db("messenger")
        .collection("chats")
        .updateOne({ user1: this.user1._id, user2: this.user2._id }, { $set: { messages: this.messages } })
    );
  };

  removeMessage = async (date: Date) => {
    const message = this.messages.find((e) => +e.date == +date);
    if (message.type == "file") {
      fs.unlinkSync(`./fileMessages/${message.src}`);
    } else if (message.type == "image") {
      fs.unlinkSync(`./imageMessages/${message.src}`);
    }
    this.messages.splice(
      this.messages.findIndex((e) => +e.date == +date),
      1
    );
    await MongoDb.then((client) =>
      client
        .db("messenger")
        .collection("chats")
        .updateOne({ user1: this.user1._id, user2: this.user2._id }, { $set: { messages: this.messages } })
    );
  };

  static getChat = async (user1Value: User, user2Value: User) => {
    const chat = await MongoDb.then((client) =>
      client
        .db("messenger")
        .collection("chats")
        .findOne({
          $or: [
            { user1: user1Value._id, user2: user2Value._id },
            { user1: user2Value._id, user2: user1Value._id },
          ],
        })
    );
    if (chat) {
      return new Chat(await User.getUserByID(chat.user1), await User.getUserByID(chat.user2), chat.messages);
    } else {
      return null;
    }
  };

  static prepareChatsForUser = async (user: User) => {
    const chats = await MongoDb.then((client) =>
      client
        .db("messenger")
        .collection("chats")
        .find({ $or: [{ user1: user._id }, { user2: user._id }] })
        .toArray()
    );
    return await Promise.all(
      chats.map(async (value) => {
        const receiver = user._id.toString() == value.user1.toString() ? 1 : 2;
        const sender = await User.getUserByID(user._id.toString() == value.user1.toString() ? value.user2 : value.user1);
        return {
          username: sender.username,
          id: user._id.toString() == value.user1.toString() ? value.user2 : value.user1,
          messages: value.messages.map((value: Message) => ({ text: value.text, received: value.sender == receiver ? 0 : 1, date: value.date, type: value.type, fileName: value.fileName, src: value.src })),
        };
      })
    );
  };

  static getImage = (src: string) => {
    const files = fs.readdirSync("./imageMessages/");
    const image = files.find((e) => e == src);
    return image;
  };

  static getFile = (src: string) => {
    const files = fs.readdirSync("./fileMessages/");
    const file = files.find((e) => e == src);
    return file;
  };
}
export default Chat;
