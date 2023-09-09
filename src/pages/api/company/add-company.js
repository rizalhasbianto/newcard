import clientPromise from "src/lib/mongodb";

export default async function addCompany(req, res) {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const collection = "company"
    const bodyObject = req.body;
    const addCompany = await db.collection(collection).insertOne(bodyObject);
    res.json({ status: 200, data: addCompany });
}