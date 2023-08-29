import { adminAPi } from 'src/lib/shopify'

export default async function createDraftOrder(req, res) {
    const bodyObject = req.body;
    const query = `
    mutation {
        draftOrderCreate(input: {
            email: "jon@skratch.co",
            lineItems: [${bodyObject.lineItems}],
            poNumber: "${bodyObject.poNumber}"
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