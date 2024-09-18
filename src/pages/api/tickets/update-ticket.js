import clientPromise from "src/lib/mongodb";
import { ObjectId } from "mongodb";
import { collectionName } from "src/data/db-collection"

export default async function updateQuote(req, res) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  const collection = collectionName.ticketsTable;
  const bodyObject = req.body;
  let dataForUpdate = bodyObject.data;

  const resSendQuote = await db
    .collection(collection)
    .updateOne({ _id: new ObjectId(bodyObject.id) }, { $set: dataForUpdate });

  res.status(200).json({ status: 200, data: resSendQuote });
}
