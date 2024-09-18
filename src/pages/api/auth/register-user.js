import clientPromise from "src/lib/mongodb";
import { collectionName } from "src/data/db-collection"
const bcrypt = require("bcrypt");

export default async function createUser(req, res) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  const collection = collectionName.userTable;
  const bodyObject = req.body;
  const password = bodyObject.password
    const saltRounds = 10;

  let hashedPassword;
  if (password) {
    hashedPassword = await new Promise((resolve, reject) => {
      bcrypt.hash(password, saltRounds, function (err, hash) {
        if (err) reject(err);
        resolve(hash);
      });
    });
  }

  const userData = {
    ...bodyObject,
    password: password ? hashedPassword : "",
  };

  const responseAddUser = await db.collection(collection).insertOne(userData);

  res.json({ status: 200, data: responseAddUser });
}
