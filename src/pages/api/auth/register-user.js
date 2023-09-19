import clientPromise from "src/lib/mongodb";

export default async function createUser(req, res) {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const collection = process.env.MONGODB_COLLECTION_USER
    const bodyObject = req.body;
    const responseAddUser = await db.collection(collection).insertOne(bodyObject);
    res.json({ status: 200, data: responseAddUser });
}