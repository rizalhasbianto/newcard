import clientPromise from "src/lib/mongodb";
import { collectionName } from "src/data/db-collection"

export default async function updateQuote(req, res) {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const collection = collectionName.quotesTable;
    const bodyObject = req.body;
    let sendQuote = "not completed"

    if(bodyObject.status === "completed") {
        sendQuote = await db.collection(collection).updateOne(
            {draftOrderId : "gid://shopify/DraftOrder/" + bodyObject.id},
            {$set : {
                status: "completed"
            }}
        );
    }
    
    res.status(200).json({ status: 200, data: sendQuote });
}