import { adminAPi } from "src/lib/shopify";

export default async function shopify(req, res) {
  const query = ` 
    mutation {
        catalogCreate (
            input: {
                context: {
                    companyLocationIds: []
                }
                status:ACTIVE,
                title:"rz1234", 
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
  res.json({ status: 200, data: resShopify });
}
