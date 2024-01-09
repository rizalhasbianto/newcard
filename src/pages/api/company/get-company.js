import clientPromise from "src/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function getQuotes(req, res) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  const collection = process.env.MONGODB_COLLECTION_COMPANY;
  const collectionUser = process.env.MONGODB_COLLECTION_USER;
  const collectionQuote = process.env.MONGODB_COLLECTION_QUOTES;
  const bodyObject = req.method === "POST" ? req.body : req.query;
  const skip =
    (Number(bodyObject.quotePage) + 1) * bodyObject.quotePostPerPage - bodyObject.quotePostPerPage;

  const data = await db
    .collection(collection)
    .find({ _id: new ObjectId(bodyObject.id) })
    .limit(1)
    .toArray();

  const dataContact = await db
    .collection(collectionUser)
    .find({ companyId: new ObjectId(data[0]._id).toString() })
    .limit(100)
    .toArray();

  data[0].contact.map((item) => {
    const matchContactData = dataContact.find(
      (contact) => new ObjectId(contact._id).toString() === item.userId
    );
    if (matchContactData) {
      item.detail = matchContactData;
    }
  });

  let relatedQuote;
  if (bodyObject.withQuote) {
    relatedQuote = await db
      .collection(collectionQuote)
      .find({ "company.name": data[0].name })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(10)
      .toArray();
  }

  const resData = {
    company: data,
    relatedQuote: relatedQuote,
  };

  res.json({ status: 200, data: resData });
}
