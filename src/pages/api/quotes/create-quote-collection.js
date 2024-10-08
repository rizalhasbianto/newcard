import clientPromise from "src/lib/mongodb";
import { collectionName } from "src/data/db-collection"

export default async function createQuote(req, res) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  const collection = collectionName.quoteCollections; 
  const bodyObject = req.body;
  const data = await db
    .collection(collection)
    .find({ collectionName: bodyObject.collectionName }) 
    .limit(parseInt(bodyObject.postPerPage) || 10)
    .toArray();

  let resSendQuote;
  if (data.length <= 0) {
    resSendQuote = await db.collection(collection).insertOne(bodyObject);
  } else {
    resSendQuote = {
      insertedId: "error",
    };
  }

  res.json({ status: 200, data: resSendQuote });
}
