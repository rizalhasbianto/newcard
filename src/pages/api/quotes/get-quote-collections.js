import clientPromise from "src/lib/mongodb";
import { ObjectId } from "mongodb";
import { collectionName } from "src/data/db-collection"

export default async function getQuotesCollections(req, res) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  const collection = collectionName.quoteCollections;
  const bodyObject = req.method === "POST" ? req.body : req.query;
  const skip = (parseInt(bodyObject.page) + 1) * bodyObject.postPerPage - bodyObject.postPerPage;

  let find = {};
  if (bodyObject.type === "id") {
    find = { _id: new ObjectId(bodyObject.query.quoteId) };
  } else {
    if (req.body) {
      find = bodyObject.query ? bodyObject.query : {};
    } else {
      find = bodyObject.query ? JSON.parse(bodyObject.query) : {};
    }
  }

  const sort = bodyObject.sort === "ASC" ? {} : { _id: -1 };
  const data = await db
    .collection(collection)
    .find(find)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(bodyObject.postPerPage) || 10)
    .toArray();
  const numberOfDoc = await db.collection(collection).countDocuments(find);
  const resData = {
    collections: data,
    count: numberOfDoc,
  };

  res.json({ status: 200, data: resData });
}