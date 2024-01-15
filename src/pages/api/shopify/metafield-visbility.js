import { adminAPi } from "src/lib/shopify";

export default async function updateProductMetafield(req, res) {
  const bodyObject = req.body;
  const query = `
      mutation {
        metafieldStorefrontVisibilityCreate(
            input: {
              ownerType:PRODUCT
                namespace: "catalogb2b"
                key: "123456"
              }
          ) {
            metafieldStorefrontVisibility {
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
