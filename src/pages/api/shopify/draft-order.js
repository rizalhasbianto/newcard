import { adminAPi } from 'src/lib/shopify'

export default async function createDraftOrder(req, res) {
  const bodyObject = req.body;
  console.log(bodyObject)
  let query
  if (bodyObject.draftOrderId) {
    query = `
      mutation {
        draftOrderUpdate(
          id: "${bodyObject.draftOrderId}",
          input: {
              email: "${bodyObject.customerEmail}",
              lineItems: [${bodyObject.lineItems}],
              poNumber: "${bodyObject.poNumber}"
          }) {
            draftOrder {
              id
              name
            }
            userErrors {
              field
              message
            }
          }
      }
    `;
  } else {
      query = `
        mutation {
          draftOrderCreate(
            input: {
              email: "${bodyObject.customerEmail}",
              lineItems: [${bodyObject.lineItems}],
              poNumber: "${bodyObject.poNumber}"
          }) {
            draftOrder {
              id
              name
            }
            userErrors {
              field
              message
            }
          }
        }
      `;
  }


  const createDraft = await adminAPi(query);
  res.json({ status: 200, createDraft });
}