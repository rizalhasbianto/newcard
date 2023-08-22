import clientPromise from "src/lib/mongodb";

export default async function getQuotes(req, res) {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const collection = "quotes";
    const bodyObject = req.body;
    const skip = ((bodyObject.page + 1)* bodyObject.postPerPage) - bodyObject.postPerPage;
    const data = await db.collection(collection).find({}).skip(skip).limit(bodyObject.postPerPage).toArray();
    const numberOfDoc =  await db.collection(collection).estimatedDocumentCount();
    const resData = {
        quote: data,
        count:numberOfDoc
    }
    res.json({ status: 200, data: resData });
}