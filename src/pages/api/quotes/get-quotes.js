import clientPromise from "src/lib/mongodb";

export default async function getQuotes(req, res) {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const collection = "quotes"
    const skip = (1 * 10) - 10;
    const data = await db.collection(collection).find({}).skip(skip).limit(10).toArray();
    res.json({ status: 200, data: data });
}