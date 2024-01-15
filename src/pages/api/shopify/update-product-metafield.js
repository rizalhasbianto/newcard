import { adminAPi } from "src/lib/shopify";

export default async function updateProductMetafield(req, res) {
  const bodyObject = req.body;
  const arr = JSON.stringify(JSON.stringify(["test1", "test5"]))
  const query = `
      mutation {
        productUpdate(
          input: {
            id: "${bodyObject.productId}"
            metafields: { 
              namespace:"custom"
              key:"testlist"
              value:${arr}
              id:"gid://shopify/Metafield/26066870960356"
            }
          }) {
            product {
              id
            }
            userErrors {
              field
              message
            }
          }
      }
    `;

  const updateMetafield = await adminAPi(query);
  res.json({ status: 200, updateMetafield });
}
