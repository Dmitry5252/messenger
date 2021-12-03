import { Request, Response } from "express";

import multer from "multer";

import User, { deleteOldAvatars } from "../model/user";

export const getAvatar = async (req: Request, res: Response) => {
  let avatar: string;
  if (req.params.email.includes("@")) {
    const user = await User.getUserByEmail(req.params.email);
    avatar = user.getAvatar();
  } else {
    const user = await User.getUserByID(req.params.email);
    avatar = user.getAvatar();
  }
  avatar ? res.sendFile(`./avatars/${avatar}`, { root: process.cwd() }) : res.sendFile(`./user.svg`, { root: process.cwd() });
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./avatars/"),
  filename: async (req, file, cb) => {
    if (!User.checkToken(req.headers.access_token as string)) {
      cb(new Error("Invalid token"), null);
    } else {
      const email = (await User.getUserByToken(req.headers.access_token as string)).email;
      cb(null, `${email}${file.originalname.slice(file.originalname.lastIndexOf("."))}`);
    }
  },
});

export const upload = multer({ storage });

export const setAvatar = (req: Request, res: Response) => {
  deleteOldAvatars(req.file.filename);
  res.sendStatus(200);
};
