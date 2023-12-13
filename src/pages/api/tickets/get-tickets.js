import clientPromise from "src/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function getQuotes(req, res) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  const collection = process.env.MONGODB_COLLECTION_QUOTES_TICKETS;
  const bodyObject = req.body ? req.body : req.query;
  const skip = (parseInt(bodyObject.page) + 1) * bodyObject.postPerPage - bodyObject.postPerPage;

  let find = {};
  if (bodyObject.type === "id") {
    find = { _id: new ObjectId(JSON.parse(bodyObject.query).ticketId) };
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
    ticket: data,
    count: numberOfDoc,
  };

  res.json({ status: 200, data: resData });
}