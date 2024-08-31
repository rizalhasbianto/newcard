import clientPromise from "src/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function getQuotes(req, res) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  const collection = process.env.MONGODB_COLLECTION_QUOTES;
  const bodyObject = req.method === "POST" ? req.body : req.query;
  const numberOfDoc = await db.collection(collection).countDocuments(JSON.parse(bodyObject.query));
  const resData = {
    count: numberOfDoc,
  };

  res.json({ status: 200, data: resData });
}
