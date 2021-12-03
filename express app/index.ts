import express from "express";
import cors from "cors";
import WebSocket from "ws";
const port = 4000;
import http from "http";

const app = express();

app.use(express.json());

app.use(cors());

import authentificationRouter from "./routes/authentification";
import avatarsRouter from "./routes/avatars";
import chatsRouter from "./routes/chats";
import usersRouter from "./routes/users";

app.use(authentificationRouter);

app.use(avatarsRouter);

app.use(chatsRouter);

app.use(usersRouter);

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

import { chatController } from "./controllers/chats";

wss.on("connection", chatController);

server.listen(port);
