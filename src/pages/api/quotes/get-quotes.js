import clientPromise from "src/lib/mongodb";
import { ObjectId } from 'mongodb'

export default async function getQuotes(req, res) {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const collection = process.env.MONGODB_COLLECTION_QUOTES;
    const bodyObject = req.body;
    console.log(req.query)
    const skip = ((bodyObject.page + 1)* bodyObject.postPerPage) - bodyObject.postPerPage;
    
    let find = {}
    if(bodyObject.type === "id") {
        find = { _id: new ObjectId(bodyObject.query.quoteId) }
    } else {
        find = bodyObject.query ? bodyObject.query : {}
    }

    const sort = bodyObject.sort === "ASC" ? {} : {_id:-1}
    const data = await db.collection(collection).find(find).sort(sort).skip(skip).limit(bodyObject.postPerPage || 10).toArray();
    const numberOfDoc =  await db.collection(collection).estimatedDocumentCount();
    const resData = {
        quote: data,
        count:numberOfDoc
    }

    res.json({ status: 200, data: resData });
}