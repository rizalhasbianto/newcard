import clientPromise from "src/lib/mongodb";
import { ObjectId } from 'mongodb'

export default async function deleteQuote(req, res) {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const collection = "quotes"
    const bodyObject = req.body;
    const deleteQuote = await db.collection(collection).deleteOne(
        {_id : new ObjectId(bodyObject.quoteId)}
    );
    res.json({ status: 200, data: deleteQuote });
}