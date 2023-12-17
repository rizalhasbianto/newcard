import clientPromise from "src/lib/mongodb";
import { ObjectId } from 'mongodb'
const bcrypt = require('bcrypt');

export default async function createQuote(req, res) {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const collection = process.env.MONGODB_COLLECTION_USER
    const bodyObject = req.body;
    const password = bodyObject.newPassword
    const saltRounds = 10;

    const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, function (err, hash) {
            if (err) reject(err)
            resolve(hash)
        });
    })

    const sendQuote = await db.collection(collection).updateOne(
        { _id: new ObjectId(bodyObject.userId) },
        { $set: { password: password ? hashedPassword : "" } }
    );
    res.json({ status: 200, data: sendQuote });
}