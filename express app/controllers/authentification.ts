import { Request, Response } from "express";
import { required, email, minLength, maxLength, composeValidators } from "../utils/validators";
import User from "../model/user";
import Chat from "../model/chat";

export const login = async (req: Request, res: Response) => {
  const user = await User.getUserByEmail(req.body.email);
  if (!user) {
    res.sendStatus(401);
  } else {
    if (user.password == req.body.password) {
      res.json({ access_token: await user.addToken(), username: user.username, email: user.email, id: user._id });
    } else res.sendStatus(401);
  }
};

export const register = async (req: Request, res: Response) => {
  if (composeValidators(required, email)(req.body.email) || composeValidators(required, minLength, maxLength)(req.body.username) || composeValidators(required, minLength, maxLength)(req.body.password)) {
    res.sendStatus(401);
  } else if (await User.getUserByEmail(req.body.email)) {
    res.status(401).json("Email already used");
  } else {
    const user = new User(req.body.email, req.body.username, req.body.password);
    user.save();
    new Chat(user, user).save();
    const token = await user.addToken();
    res.json({ access_token: token, username: req.body.username, email: req.body.email, id: user._id });
  }
};

export const auth = async (req: Request, res: Response) => {
  if (!(await User.checkToken(req.headers.access_token as string))) {
    res.sendStatus(401);
  } else {
    const user = await User.getUserByToken(req.headers.access_token as string);
    res.json({ name: user.username, email: user.email, id: user._id });
  }
};
