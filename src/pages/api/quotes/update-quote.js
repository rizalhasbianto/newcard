import clientPromise from "src/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function updateQuote(req, res) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  const collection = process.env.MONGODB_COLLECTION_QUOTES;
  const bodyObject = req.body;

  let dataForUpdate = bodyObject.data;

  if (bodyObject.type === "item") {
    const resData = await db
      .collection(collection)
      .find({ _id: new ObjectId(bodyObject.quoteId) })
      .sort({})
      .limit(parseInt(bodyObject.postPerPage) || 10)
      .toArray();
    let quoteList = resData[0].quotesList;
    if (quoteList) {
      quoteList.push(dataForUpdate.quotesList);
    } else {
      quoteList = [dataForUpdate.quotesList];
    }
    dataForUpdate = { quotesList: quoteList };
  }

  const resSendQuote = await db
    .collection(collection)
    .updateOne({ _id: new ObjectId(bodyObject.quoteId) }, { $set: dataForUpdate });

  res.status(200).json({ status: 200, data: resSendQuote });
}
