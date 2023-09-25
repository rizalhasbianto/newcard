import clientPromise from "src/lib/mongodb";
import { ObjectId } from 'mongodb'

export default async function createQuote(req, res) {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const collection = "quotes"
    const bodyObject = req.body;
    const pipeline = [
      {
       $match: {
        operationType: {
         $in: [
          "insert",
          "update"
         ]
        },
       }
      }
     ]
    const changeStream = db.collection(collection).watch(pipeline);
    let data
    changeStream.on('change', next => {
        // process next document
        data = next
      });    
    console.log("closed the change stream");
    res.json({ status: 200, data: data?._id?._data });
}