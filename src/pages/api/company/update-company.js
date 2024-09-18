import clientPromise from "src/lib/mongodb";
import { ObjectId } from "mongodb";
import { collectionName } from "src/data/db-collection"

export default async function updateMongo(req, res) {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const collection = collectionName.companyTable
    const bodyObject = req.body;
    
    if(bodyObject.updateData.contacts?.length > 0) {
        bodyObject.updateData.contacts.map((item) => {
            if (item.detail) {
              delete item.detail;
            }
          });
    }
    const resMongo = await db.collection(collection).updateOne({ _id: new ObjectId(bodyObject.id) }, { $set: bodyObject.updateData});
    console.log("resMongo", resMongo)
    res.json({ status: 200, data: resMongo });
}