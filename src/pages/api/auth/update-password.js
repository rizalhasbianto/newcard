import clientPromise from "src/lib/mongodb";
import { ObjectId } from "mongodb";
import { collectionName } from "src/data/db-collection";
const bcrypt = require("bcrypt");

export default async function createQuote(req, res) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  const collection = collectionName.userTable;
  const bodyObject = req.body;
  const password = bodyObject.newPassword;
  const saltRounds = 10;

  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) reject(err);
      resolve(hash);
    });
  });

  const userData = {
    ...bodyObject,
    password: password ? hashedPassword : "",
  };

  delete userData.newPassword;

  const sendQuote = await db
    .collection(collection)
    .updateOne({ _id: new ObjectId(bodyObject.userId) }, { $set: userData });
  res.json({ status: 200, data: sendQuote });
}
