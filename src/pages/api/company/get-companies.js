import clientPromise from "src/lib/mongodb";

export default async function getQuotes(req, res) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  const collection = process.env.MONGODB_COLLECTION_COMPANY;
  const quote = process.env.MONGODB_COLLECTION_QUOTES;
  const bodyObject = req.method === "POST" ? req.body : req.query;
  const queryCompany = bodyObject.type === "check" ? bodyObject.query : {};
  const postPerPage = bodyObject.postPerPage ? Number(bodyObject.postPerPage) : 10;
  const skip = (Number(bodyObject.page) + 1) * bodyObject.postPerPage - bodyObject.postPerPage;

  const data = await db
    .collection(collection)
    .find(queryCompany)
    .project(!bodyObject.avatar ? { avatar: 0 } : "")
    .sort({ _id: -1 })
    .skip(skip)
    .limit(postPerPage)
    .toArray();

  let relatedQuote;
  if (bodyObject.withQuote) {
    relatedQuote = await db
      .collection(quote)
      .find({ "company.name": { $in: ["bango 7849373111", "brownka"] }, status: "open" })
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
