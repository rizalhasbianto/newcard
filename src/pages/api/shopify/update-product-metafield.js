import { adminAPi } from "src/lib/shopify";

export default async function updateProductMetafield(req, res) {
  const bodyObject = req.body;
  const catalogList = bodyObject.shopifyCatalog ? JSON.parse(bodyObject.shopifyCatalog.value): [];
  console.log("catalogList", bodyObject.shopifyCatalog)
  const arr = JSON.stringify(JSON.stringify([...catalogList, bodyObject.catalogId]));
  const query = `
      mutation {
        productUpdate(
          input: {
            id: "${bodyObject.productId}"
            metafields: { 
              namespace:"b2b"
              key:"catalog"
              value:${arr}
              ${
                bodyObject.shopifyCatalog ? 
                `id:"${bodyObject.shopifyCatalog.id}"` : 
                `type:"list.single_line_text_field"`
              }
              
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
  console.log(updateMetafield.data.productUpdate.userErrors)
  res.json({ status: 200, updateMetafield });
}
