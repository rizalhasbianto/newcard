import clientPromise from "src/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function updateCompany(req, res) {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const collection = process.env.MONGODB_COLLECTION_COMPANY
    const bodyObject = req.body;
    console.log(bodyObject)
    const addCompany = await db.collection(collection).updateOne({ _id: new ObjectId(bodyObject.id) }, { $set: bodyObject.updateData});
    res.json({ status: 200, data: addCompany });
}