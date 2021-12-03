import { MongoClient } from "mongodb";

const MongoDb: Promise<MongoClient> = new Promise((resolve, reject) =>
  MongoClient.connect("mongodb://localhost:27018/", (e, connectedClient) => {
    if (e) {
      reject();
    } else {
      resolve(connectedClient);
    }
  })
);

export default MongoDb;
