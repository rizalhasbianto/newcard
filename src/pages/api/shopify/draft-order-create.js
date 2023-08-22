import { adminAPi } from 'src/lib/shopify'

export default async function createDraftOrder(req, res) {
    const bodyObject = req.body;
    const query = `
    mutation {
        draftOrderCreate(input: {
            email: "donato@gmail.com",
            lineItems: [${bodyObject.lineItems}]
        }) {
          draftOrder {
            id
          }
          userErrors {
            field
            message
          }
        }
    }
    `;

  const createDraft = await adminAPi(query);
  res.json({ status: 200, createDraft });
}