import clientPromise from "src/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function getData(req, res) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  const collectionCompany = process.env.MONGODB_COLLECTION_COMPANY;
  const collectionQuote = process.env.MONGODB_COLLECTION_QUOTES;
  const collectionUser = process.env.MONGODB_COLLECTION_USER;
  const bodyObject = req.method === "POST" ? req.body : req.query;
  const postPerPage = bodyObject.postPerPage ? Number(bodyObject.postPerPage) : 10;
  const skip = (Number(bodyObject.page) + 1) * bodyObject.postPerPage - bodyObject.postPerPage;

  const queryCompany = (filterData, search) => {
    const query = []
    const queryObj = !filterData || filterData === "undefined" ? {} : JSON.parse(filterData);
    if (queryObj.id) {
      query.push( { _id: new ObjectId(queryObj.id) });
    } else {
      query.push( queryObj );
    }
    if (search && search !== "undefined") {
      query.push( {name:{$regex:search,$options:'i'}} )
    }

    return {$and: query};
  };

  const data = await db
    .collection(collectionCompany)
    .find(queryCompany(bodyObject.query, bodyObject.search))
    .project(!bodyObject.avatar ? { avatar: 0 } : "")
    .sort({ _id: -1 })
    .skip(skip)
    .limit(postPerPage)
    .toArray();

  const companyNames = data.map((item) => item.name);
  const companyIds = data.map((item) => new ObjectId(item._id).toString());

  const dataContact = await db
    .collection(collectionUser)
    .find({ "company.companyId": { $in: companyIds } })
    .project({ name: 1, email: 1, phone: 1, shopifyCustomerId: 1 })
    .limit(100)
    .toArray();

  data.map((company) => {
    company.contacts.map((item) => {
      const matchContactData = dataContact.find(
        (contact) => new ObjectId(contact._id).toString() === item.userId
      );
      if (matchContactData) {
        item.detail = matchContactData;
      }
    });
  });

  let relatedQuote = [];
  if (bodyObject.withQuote === "true") {
    console.log("run get companies with quote")
    relatedQuote = await db
      .collection(collectionQuote)
      .find({ "company.name": { $in: companyNames }, status: "open" })
      .sort({ _id: -1 })
      .limit(1000)
      .toArray();
  }

  const numberOfDoc = await db
    .collection(collectionCompany)
    .countDocuments(queryCompany(bodyObject.query));

  const resData = {
    company: data,
    relatedQuote: relatedQuote,
    count: numberOfDoc,
  };
  res.json({ status: 200, data: resData });
}
