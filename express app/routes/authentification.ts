import express from "express";
const router = express.Router();

import { login, register, auth } from "../controllers/authentification";

router.post("/login", login);

router.post("/register", register);

router.get("/auth", auth);

export default router;
