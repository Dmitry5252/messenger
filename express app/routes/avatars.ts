import express from "express";
const router = express.Router();

import { getAvatar, upload, setAvatar } from "../controllers/avatars";

router.get("/avatar/:email/*", getAvatar);

router.post("/setAvatar", upload.single("avatar"), setAvatar);

export default router;
