import express from "express";
const router = express.Router();

import { users } from "../controllers/users";

router.get("/users/:username", users);

export default router;
