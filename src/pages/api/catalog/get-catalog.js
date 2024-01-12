import clientPromise from "src/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function getData(req, res) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  const collection = process.env.MONGODB_COLLECTION_QUOTES_CATALOG;
  const bodyObject = req.method === "POST" ? req.body : req.query;
  const postPerPage = bodyObject.postPerPage ? Number(bodyObject.postPerPage) : 10;
  const skip = (Number(bodyObject.page) + 1) * bodyObject.postPerPage - bodyObject.postPerPage;

  const queryCompany = (filterData) => {
    if (!filterData || filterData === "undefined") return {};

    const queryObj = JSON.parse(filterData)
    if (queryObj.id) {
      return { _id: new ObjectId(queryObj.id) };
    }
    return queryObj;
  };

  const data = await db
    .collection(collection)
    .find(queryCompany(bodyObject.query))
    .skip(skip)
    .limit(postPerPage)
    .toArray();
  
  res.json({ status: 200, data: data });
}
