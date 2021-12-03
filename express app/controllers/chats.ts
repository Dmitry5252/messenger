import { Request, Response } from "express";
import multer from "multer";
import User from "../model/user";
import Chat from "../model/chat";
import { WebSocket } from "ws";
import { IncomingMessage } from "http";

const connections: { user: User; connection: WebSocket }[] = [];

const getConnectionsByUser = (user: User) => connections.filter((e) => e.user._id.toString() == user._id.toString()).map((e) => e.connection);

const updateChatsForUsers = async (sender: User, receiver: User) => {
  const senderChats = await Chat.prepareChatsForUser(sender);
  getConnectionsByUser(sender).forEach((e) => e.send(JSON.stringify(senderChats)));
  const receiverChats = await Chat.prepareChatsForUser(receiver);
  getConnectionsByUser(receiver).forEach((e) => e.send(`received${JSON.stringify(receiverChats)}`));
};

export const getImageMessageController = (req: Request, res: Response) => {
  const image = Chat.getImage(req.params.src);
  if (image) {
    res.sendFile(`./imageMessages/${image}`, { root: process.cwd() });
  } else {
    res.sendStatus(404);
  }
};

export const getFileMessageController = (req: Request, res: Response) => {
  const file = Chat.getFile(req.params.src);
  if (file) {
    res.sendFile(`./fileMessages/${file}`, { root: process.cwd() });
  } else {
    res.sendStatus(404);
  }
};

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./imageMessages/");
  },
});

export const imageUpload = multer({ storage: imageStorage });

export const sendImageMessageController = async (req: Request, res: Response) => {
  if (!User.checkToken(req.headers.access_token as string)) {
    res.sendStatus(403);
  } else if (!(await User.getUserByID(req.headers.receiver as string))) {
    res.sendStatus(401);
  } else {
    const sender = await User.getUserByToken(req.headers.access_token as string);
    const receiver = await User.getUserByID(req.headers.receiver as string);
    const chat = await Chat.getChat(sender, receiver);
    await chat.addImageMessage(req.file.originalname, req.file.filename, sender);
    await updateChatsForUsers(sender, receiver);
    res.sendStatus(200);
  }
};

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./fileMessages/");
  },
});

export const fileUpload = multer({ storage: fileStorage });

export const sendFileMessageController = async (req: Request, res: Response) => {
  if (!(await User.checkToken(req.headers.access_token as string))) {
    res.sendStatus(403);
  } else if (!(await User.getUserByID(req.headers.receiver as string))) {
    res.sendStatus(401);
  } else {
    const sender = await User.getUserByToken(req.headers.access_token as string);
    const receiver = await User.getUserByID(req.headers.receiver as string);
    const chat = await Chat.getChat(sender, receiver);
    await chat.addFileMessage(req.file.originalname, req.file.filename, sender);
    await updateChatsForUsers(sender, receiver);
    res.sendStatus(200);
  }
};

export const deleteMessageController = async (req: Request, res: Response) => {
  if (!(await User.checkToken(req.headers.access_token as string))) {
    res.sendStatus(403);
  } else if (!(await User.getUserByID(req.headers.receiver as string))) {
    res.sendStatus(401);
  } else {
    const senderUser = await User.getUserByToken(req.headers.access_token as string);
    const receiverUser = await User.getUserByID(req.headers.receiver as string);
    const chat = await Chat.getChat(senderUser, receiverUser);
    const message = chat.messages.find((e) => +e.date == +new Date(req.headers.time as string));
    if (!message) {
      res.sendStatus(401);
    } else {
      const sender = chat.user1._id.toString() == senderUser._id.toString() ? 1 : 2;
      if (message.sender != sender) {
        res.sendStatus(403);
      } else {
        await chat.removeMessage(new Date(`${req.headers.time}`));
        await updateChatsForUsers(senderUser, receiverUser);
        res.sendStatus(200);
      }
    }
  }
};

export const chatController = async (ws: WebSocket, req: IncomingMessage) => {
  if (!User.checkToken(req.url.slice(7))) {
    ws.send("Invalid token");
    ws.close();
  } else {
    const user = await User.getUserByToken(req.url.slice(7));
    connections.push({ user, connection: ws });
    const chats = await Chat.prepareChatsForUser(user);
    ws.send(JSON.stringify(chats));
    ws.on("message", async (m) => {
      const receiverUser = await User.getUserByID(m.toString().slice(0, 24));
      if (receiverUser) {
        if (!(await Chat.getChat(user, receiverUser))) {
          await new Chat(user, receiverUser).save();
        }
        const chat = await Chat.getChat(user, receiverUser);
        await chat.addMessage(m.toString().slice(24), user);
        await updateChatsForUsers(user, receiverUser);
      }
    });
  }
};
