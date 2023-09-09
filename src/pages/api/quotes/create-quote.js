import clientPromise from "src/lib/mongodb";

export default async function createQuote(req, res) {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const collection = "quotes"
    const bodyObject = req.body;
    const sendQuote = await db.collection(collection).insertOne(bodyObject);
    res.json({ status: 200, data: sendQuote });
}