import clientPromise from "src/lib/mongodb";
import { ObjectId } from 'mongodb'
import { collectionName } from "src/data/db-collection"
const bcrypt = require('bcrypt');

export default async function createQuote(req, res) {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const collection = collectionName.userTable
    const bodyObject = req.body;
    console.log(bodyObject)
    const sendQuote = await db.collection(collection).updateOne(
        { _id: new ObjectId(bodyObject.id) },
        { $set: bodyObject.updateData }
    );
    
    res.json({ status: 200, data: "success update" });
}