import clientPromise from "src/lib/mongodb";

export default async function getQuotes(req, res) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  const collection = process.env.MONGODB_COLLECTION_COMPANY;
  const bodyObject = req.method === "POST" ? req.body : req.query;
  const queryCompany = bodyObject.type === "check" ? bodyObject.query : {};
  const postPerPage = bodyObject.postPerPage ? Number(bodyObject.postPerPage) : 10;
  const avatar = bodyObject.avatar ? 1 : 0
  const skip = (bodyObject.page + 1) * bodyObject.postPerPage - bodyObject.postPerPage;
  const data = await db
    .collection(collection)
    .find(queryCompany)
    .project({ avatar: avatar })
    .sort({ _id: -1 })
    .skip(skip)
    .limit(postPerPage)
    .toArray();
  const numberOfDoc = await db.collection(collection).estimatedDocumentCount();
  const resData = {
    company: data,
    count: numberOfDoc,
  };

  res.json({ status: 200, data: resData });
}
