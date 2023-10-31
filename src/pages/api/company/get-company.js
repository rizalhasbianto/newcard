import clientPromise from "src/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function getQuotes(req, res) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  const collection = process.env.MONGODB_COLLECTION_COMPANY;
  const quote = process.env.MONGODB_COLLECTION_QUOTES;
  const bodyObject = req.method === "POST" ? req.body : req.query;
  const skip = (Number(bodyObject.quotePage) + 1) * bodyObject.quotePostPerPage - bodyObject.quotePostPerPage;

  const data = await db
    .collection(collection)
    .find({ _id: new ObjectId(bodyObject.id) })
    .limit(1)
    .toArray();

    console.log("data", data)

  let relatedQuote;
  if (bodyObject.withQuote) {
    relatedQuote = await db
      .collection(quote)
      .find({ "company.name": data[0].name})
      .sort({ _id: -1 })
      .skip(skip)
      .limit(10)
      .toArray();
  }

  const numberOfDoc = await db.collection(quote).countDocuments({ "company.name": data[0].name});

  const resData = {
    company: data,
    relatedQuote: relatedQuote,
    countQuote: numberOfDoc,
  };

  res.json({ status: 200, data: resData });
}
