import { adminAPi } from "src/lib/shopify";

export default async function updateProductMetafield(req, res) {
  const bodyObject = req.body;
  const query = `
      mutation {
        metafieldDefinitionCreate(
          definition: {
              name:"catalogb2b-2"
              ownerType:PRODUCT
              type:"single_line_text_field"
                namespace: "b2b-2"
                key: "catalog-3"
              }
          ) {
            createdDefinition {
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
