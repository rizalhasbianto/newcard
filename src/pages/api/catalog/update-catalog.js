import clientPromise from "src/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function updateMongo(req, res) {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const collection = process.env.MONGODB_COLLECTION_QUOTES_CATALOG
    const bodyObject = req.body;
    
    if(bodyObject.updateData.contact?.length > 0) {
        bodyObject.updateData.contact.map((item) => {
            if (item.detail) {
              delete item.detail;
            }
          });
    }
    const resMongo = await db.collection(collection).updateOne({ _id: new ObjectId(bodyObject.id) }, { $set: bodyObject.updateData});
    res.json({ status: 200, data: resMongo });
}