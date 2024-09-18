import clientPromise from "src/lib/mongodb";
import { collectionName } from "src/data/db-collection"

export default async function createCatalog(req, res) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  const collection = collectionName.quoteCatalogTable;
  const bodyObject = req.body;
  const mongoRes = await db.collection(collection).insertOne(bodyObject);
  res.json({ status: 200, data: mongoRes });
}
