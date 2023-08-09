import clientPromise from "../../lib/mongodb";
const bcrypt = require('bcrypt');

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  const saltRounds = 10;
  const myPlaintextPassword = 'Password123!';
  const someOtherPlaintextPassword = 'not_bacon';

  bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
    console.log(hash)
  });

  const match = await bcrypt.compare(myPlaintextPassword, "$2b$10$pHvz2qFL999AjVz4x.lJ4.y2GSArjKTYf9hAHPbA2PQnNMIfzUkdG");
  console.log("matchPass", match)
  switch (req.method) {
    case "POST":
      let bodyObject = JSON.parse(req.body);
      let myPost = await db.collection("user").insertOne(bodyObject);
      res.json({ status: 200, data: "success" });
      break;
    case "GET":
      const getData = await db.collection("user").find({ email: "jane@abc.com" }).limit(10).toArray();
      res.json({ status: 200, data: getData });
      break;
  }
}