import clientPromise from "src/lib/mongodb";
import { ObjectId } from 'mongodb'

export default async function getQuotes(req, res) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  const collection = process.env.MONGODB_COLLECTION_COMPANY;
  const quote = process.env.MONGODB_COLLECTION_QUOTES;
  const bodyObject = req.method === "POST" ? req.body : req.query;
  const postPerPage = bodyObject.postPerPage ? Number(bodyObject.postPerPage) : 10;
  const skip = (Number(bodyObject.page) + 1) * bodyObject.postPerPage - bodyObject.postPerPage;

  const queryCompany = (bodyObject) => {
    if(!bodyObject.query) return
    if(bodyObject.query._id) {
      return { _id: new ObjectId(bodyObject.query._id)}
    } 
    return  bodyObject.query
  }


  const data = await db
    .collection(collection)
    .find(queryCompany(bodyObject))
    .project(!bodyObject.avatar ? { avatar: 0 } : "")
    .sort({ _id: -1 })
    .skip(skip)
    .limit(postPerPage)
    .toArray();
  const companyNames = data.map((item) => item.name);
  let relatedQuote;
  if (bodyObject.withQuote) {
    relatedQuote = await db
      .collection(quote)
      .find({ "company.name": { $in: companyNames }, status: "open" })
      .sort({ _id: -1 })
      .limit(1000)
      .toArray();
  }
  const numberOfDoc = await db.collection(collection).estimatedDocumentCount();
  const resData = {
    company: data,
    relatedQuote: relatedQuote,
    count: numberOfDoc,
  };
  res.json({ status: 200, data: resData });
}
