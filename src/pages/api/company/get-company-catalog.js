import clientPromise from "src/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function mongo(req, res) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  const companyCOl = process.env.MONGODB_COLLECTION_COMPANY;
  const bodyObject = req.method === "POST" ? req.body : req.query

  const query = bodyObject.id && bodyObject.id !== "undefined" ? { _id: new ObjectId(bodyObject.id) } : JSON.parse(bodyObject.query)
  console.log("query", query)
  const newData = await db
    .collection(companyCOl)
    .find(query)
    .project({ catalogIDs: 1, shopifyCompanyLocationId: 1 })
    .limit(1)
    .toArray();

    res.json({ status: 200, newData });
}
