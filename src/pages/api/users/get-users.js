import clientPromise from "src/lib/mongodb";

export default async function getUsers(req, res) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  const collection = process.env.MONGODB_COLLECTION_USER;
  const bodyObject = req.method === "POST" ? req.body : req.query;
  const queryUsers = bodyObject.type === "single" ? bodyObject.query : {role: { $nin: ["admin"] }};
  const postPerPage = bodyObject.postPerPage ? Number(bodyObject.postPerPage) : 10;
  const skip = (Number(bodyObject.page) + 1) * bodyObject.postPerPage - bodyObject.postPerPage;
  const data = await db
    .collection(collection) 
    .find(queryUsers)
    .project({ password: 0 })
    .sort({ _id: -1 })
    .skip(skip)
    .limit(postPerPage)
    .toArray();

  const numberOfDoc = await db.collection(collection).countDocuments(queryUsers);
  const resData = {
    user: data,
    count: numberOfDoc,
  };
  res.json({ status: 200, data: resData });
}
