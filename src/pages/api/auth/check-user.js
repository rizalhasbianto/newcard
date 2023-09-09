import clientPromise from "src/lib/mongodb";

export default async function createUser(req, res) {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const response = await db.collection("user").find({ email: req.body.email }).limit(10).toArray();
    res.json({ status: 200, data: response });
}