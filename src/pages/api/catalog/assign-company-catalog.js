import { adminAPi } from "src/lib/shopify";
import clientPromise from "src/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function shopify(req, res) {
  const bodyObject = req.method === "POST" ? req.body : req.query;
  const locationIDs = JSON.stringify(bodyObject.updateData.companyLocationIds);
  const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const collection = process.env.MONGODB_COLLECTION_COMPANY

  const query = ` 
    mutation {
        catalogUpdate (
            id:"${bodyObject.catalogID}"
            input: {
                context: {
                    companyLocationIds: ${locationIDs}
                }
            }
        ) {
            catalog {
                id
            }
            userErrors {
                field
                message
            }
        }
    }
`;

  const resShopify = await adminAPi(query);
  if(resShopify && resShopify.data?.catalogUpdate?.userErrors?.length === 0) {
    if(bodyObject.updateData.selected) {
        await db.collection(collection).updateOne({ _id: new ObjectId(bodyObject.updateData.mongoCompanyID) }, { $push: {catalogIDs:bodyObject.catalogID.replace("gid://shopify/CompanyLocationCatalog/","")}});
    } else {
        await db.collection(collection).updateOne({ _id: new ObjectId(bodyObject.updateData.mongoCompanyID) }, { $pull: {catalogIDs:bodyObject.catalogID.replace("gid://shopify/CompanyLocationCatalog/","")}});
    }
    
  }

  res.json({ status: 200, data: resShopify });
}
