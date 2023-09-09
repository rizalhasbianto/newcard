import clientPromise from "src/lib/mongodb";
import { ObjectId } from 'mongodb'

export default async function createQuote(req, res) {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const collection = "quotes"
    const bodyObject = req.body;
    const sendQuote = await db.collection(collection).updateOne(
        {_id : new ObjectId(bodyObject.quoteId)},
        {$set :{"draftOrderId" : bodyObject.draftOrderId}}
    );
    res.json({ status: 200, data: sendQuote });
}