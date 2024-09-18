import clientPromise from "src/lib/mongodb";
import { collectionName } from "src/data/db-collection"

export default async function getQuotes(req, res) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  const collection = collectionName.quotesTable;
  const bodyObject = req.method === "POST" ? req.body : req.query;
  const numberOfDoc = await db.collection(collection).countDocuments(JSON.parse(bodyObject.query));
  const resData = {
    count: numberOfDoc,
  };

  res.json({ status: 200, data: resData });
}
