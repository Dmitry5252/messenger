import { Request, Response } from "express";
import User from "../model/user";

export const users = async (req: Request, res: Response) => {
  const user = await User.getUserByToken(req.headers.access_token as string);
  const users = await User.getUsers();
  const result = users.filter((e) => e.username.toLowerCase().includes(req.params.username.toLowerCase()) && e._id != user._id).map((e) => ({ username: e.username, id: e._id }));
  res.json(result);
};
