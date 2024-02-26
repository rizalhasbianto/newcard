import { adminAPi } from "src/lib/shopify";
import clientPromise from "src/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function shopify(req, res) {
    const bodyObject = req.body ? req.body : req.query
    const locationIDs = JSON.stringify(bodyObject.updateData.companyLocationIds)
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
console.log(resShopify)
  res.json({ status: 200, data: resShopify });
}
