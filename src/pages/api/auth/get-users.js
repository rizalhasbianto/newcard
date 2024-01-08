import clientPromise from "src/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function getUsers(req, res) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  const collection = process.env.MONGODB_COLLECTION_USER;
  const collectionCompany = process.env.MONGODB_COLLECTION_COMPANY;
  const bodyObject = req.method === "POST" ? req.body : req.query;
  const queryObjectParse = bodyObject.query ? JSON.parse(bodyObject.query) : {};
  const sessionRole = bodyObject.sessionRole ? JSON.parse(bodyObject.sessionRole) : {};
  const postPerPage = bodyObject.postPerPage ? Number(bodyObject.postPerPage) : 10;
  const skip = (Number(bodyObject.page) + 1) * bodyObject.postPerPage - bodyObject.postPerPage;

  const companyList = [];
  if (sessionRole.role === "sales") {
    const data = await db
      .collection(collectionCompany)
      .find({ "sales.id": sessionRole.id })
      .project({ password: 0 })
      .limit(100)
      .toArray();

    data.map((item) => companyList.push(new ObjectId(item._id).toString()));
  }

  const queryRole = companyList.length > 0 ? { "company.companyId": { $in: companyList } } : {};
  const queryObject = queryObjectParse.role
    ? { ...queryObjectParse }
    : { ...queryObjectParse, role: { $nin: ["admin"] } };
  const queryUsers = {
    ...queryObject,
    ...queryRole,
  };

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
