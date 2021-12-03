import fs from "fs";

import MongoDb from "../db";

import { ObjectId } from "mongodb";

interface User {
  email: string;
  username: string;
  password: string;
  _id: ObjectId;
}

class User {
  constructor(email: string, username: string, password: string, _id = new ObjectId()) {
    this.email = email;
    this.username = username;
    this.password = password;
    this._id = _id;
  }

  save = () => {
    MongoDb.then((client) => client.db("messenger").collection("users").insertOne({ email: this.email.toLowerCase(), username: this.username, password: this.password, _id: this._id }));
  };

  getAvatar = () => {
    const files = fs.readdirSync("./avatars/");
    const avatar = files.find((e) => e.slice(0, e.lastIndexOf(".")) == this.email);
    return avatar;
  };

  addToken = async () => {
    const token = newToken();
    MongoDb.then((client) => client.db("messenger").collection("tokens").insertOne({ user: this._id, token }));
    return token;
  };

  static checkToken = async (token: string) => {
    const user = await MongoDb.then((client) => client.db("messenger").collection("tokens").findOne({ token }));
    return user ? true : false;
  };

  static getUsers = async () =>
    await MongoDb.then((client) =>
      client
        .db("messenger")
        .collection("users")
        .find()
        .toArray()
        .then((array) => array.map((e) => new User(e.email, e.username, e.password, e._id)))
    );

  static getUserByID = async (idValue: string) => {
    const user = await MongoDb.then((client) =>
      client
        .db("messenger")
        .collection("users")
        .findOne({ _id: new ObjectId(idValue) })
    );
    if (user) {
      return new User(user.email, user.username, user.password, user._id);
    } else {
      return null;
    }
  };

  static getUserByEmail = async (emailValue: string) => {
    const user = await MongoDb.then((client) => client.db("messenger").collection("users").findOne({ email: emailValue.toLowerCase() }));
    if (user) {
      return new User(user.email, user.username, user.password, user._id);
    } else {
      return null;
    }
  };

  static getUserByToken = async (token: string) => {
    const userValue = await MongoDb.then((client) => client.db("messenger").collection("tokens").findOne({ token }));
    if (userValue) {
      return await User.getUserByID(userValue.user);
    } else {
      return null;
    }
  };
}

const newToken = () =>
  Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "");

export const deleteOldAvatars = (newAvatar: string) => {
  const files = fs.readdirSync("./avatars");
  const oldImages = files.filter((e) => e.slice(0, e.lastIndexOf(".")) == newAvatar.slice(0, newAvatar.lastIndexOf(".")) && e != newAvatar);
  if (oldImages) {
    oldImages.forEach((e) => fs.unlinkSync(`./avatars/${e}`));
  }
};

export default User;
