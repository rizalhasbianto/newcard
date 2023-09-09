import clientPromise from "src/lib/mongodb";

export default async function getQuotes(req, res) {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const collection = "company";
    const bodyObject = req.body;
    const queryCompany = bodyObject.type === "check" ? bodyObject.query : {}
    const postPerPage = bodyObject.postPerPage ? bodyObject.postPerPage : 10
    const skip = ((bodyObject.page + 1)* bodyObject.postPerPage) - bodyObject.postPerPage;
    const data = await db.collection(collection).find(queryCompany).sort({_id:-1}).skip(skip).limit(postPerPage).toArray();
    const numberOfDoc =  await db.collection(collection).estimatedDocumentCount();
    const resData = {
        company: data,
        count:numberOfDoc
    }
    
    res.json({ status: 200, data: resData });
}