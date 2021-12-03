import express from "express";
const router = express.Router();

import { imageUpload, getImageMessageController, sendImageMessageController, fileUpload, getFileMessageController, sendFileMessageController, deleteMessageController } from "../controllers/chats";

router.post("/sendImageMessage", imageUpload.single("image"), sendImageMessageController);

router.post("/sendFileMessage", fileUpload.single("file"), sendFileMessageController);

router.get("/getImage/:src/*", getImageMessageController);

router.get("/getFile/:src/*", getFileMessageController);

router.delete("/deleteMessage", deleteMessageController);

export default router;
