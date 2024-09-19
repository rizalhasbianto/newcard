import clientPromise from "src/lib/mongodb";
import { ObjectId } from 'mongodb'
import { collectionName } from "src/data/db-collection"

export default async function deleteQuoteCollection(req, res) {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const collection = collectionName.quoteCollections
    const bodyObject = req.body;
    const deleteQuote = await db.collection(collection).deleteOne(
        {_id : new ObjectId(bodyObject.quoteId)}
    );
    res.json({ status: 200, data: deleteQuote });
}