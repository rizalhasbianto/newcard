import clientPromise from "src/lib/mongodb";
import { ObjectId } from 'mongodb'

export default async function updateQuote(req, res) {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const collection = process.env.MONGODB_COLLECTION_QUOTES;
    const bodyObject = req.body;
    const sendQuote = await db.collection(collection).updateOne(
        {_id : new ObjectId(bodyObject.quoteId)},
        {$set :bodyObject.data}
    );
    res.status(200).json({ status: 200, data: sendQuote });
}