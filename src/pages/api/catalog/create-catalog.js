import clientPromise from "src/lib/mongodb";

export default async function createCatalog(req, res) {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const collection = process.env.MONGODB_COLLECTION_QUOTES_CATALOG
    const bodyObject = req.body;
    const mongoRes = await db.collection(collection).insertOne(bodyObject);
    res.json({ status: 200, data: mongoRes });
}