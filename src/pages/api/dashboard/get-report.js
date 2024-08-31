import clientPromise from "src/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function getData(req, res) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  const collection = "report";

  const data = await db
    .collection(collection)
    .find({})
    .sort({ _id:-1 })
    .limit(1)
    .toArray();

  res.json({ status: 200, newData:data });
}
