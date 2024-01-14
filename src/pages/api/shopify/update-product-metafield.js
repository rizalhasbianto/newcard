import { adminAPi } from "src/lib/shopify";

export default async function updateProductMetafield(req, res) {
  const bodyObject = req.body;
  const query = `
      mutation {
        productUpdate(
          input: {
            id: "${bodyObject.productId}"
            metafields: {
              namespace:"b2b"
              key:"catalog"
              type:"single_line_text_field"
              value:"${bodyObject.catalogId}"
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
