import clientPromise from "src/lib/mongodb";
import { collectionName } from "src/data/db-collection"

export default async function addCompany(req, res) {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const collection = collectionName.companyTable;
    const bodyObject = req.body;
    const addCompany = await db.collection(collection).insertOne(bodyObject);
    res.json({ status: 200, data: addCompany }); 
}