import { adminAPi } from 'src/lib/shopify'

export default async function createDraftOrder(req, res) {
  const bodyObject = req.body;

  let query
  if (bodyObject.draftOrderId) {
    query = `
      mutation {
        draftOrderUpdate(
          id: "${bodyObject.draftOrderId}",
          input: {
              email: "${bodyObject.customerEmail}",
              lineItems: [${bodyObject.lineItems}],
              poNumber: "${bodyObject.poNumber}",
              appliedDiscount: {
                valueType:${bodyObject.discount.type},
                value:${bodyObject.discount.amount}
              }
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
              poNumber: "${bodyObject.poNumber}",
              appliedDiscount: {
                valueType:${bodyObject.discount.type},
                value:${bodyObject.discount.amount}
              }
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
  console.log("createDraft", createDraft)
  res.json({ status: 200, createDraft });
}