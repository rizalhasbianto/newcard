import clientPromise from "src/lib/mongodb";
import { ObjectId } from 'mongodb'

export default async function checkUser(req, res) {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const bodyObject = req.body;
    const collection = process.env.MONGODB_COLLECTION_USER
    const query = bodyObject.type === "id" ? { _id: new ObjectId(bodyObject.query.id)} : bodyObject.query;
    const response = await db.collection(collection).find(query).limit(10).toArray();
    res.json({ status: 200, data: response });
}