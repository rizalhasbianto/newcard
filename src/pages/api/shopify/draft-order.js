import { adminAPi } from "src/lib/shopify";

export default async function createDraftOrder(req, res) {
  const bodyObject = req.body;
  let query;
  if (bodyObject.draftOrderId) {
    query = `
      mutation {
        draftOrderUpdate(
          id: "${bodyObject.draftOrderId}",
          input: {
              email: "${bodyObject.customerEmail}",
              lineItems: [${bodyObject.lineItems}],
              poNumber: "${bodyObject.poNumber}",
              ${
                bodyObject.discount.amount &&
                `appliedDiscount: {
                    valueType:${bodyObject.discount.type},
                    value:${bodyObject.discount.amount}
                  }`
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
              tags:"b2b",
              ${
                bodyObject.discount.amount &&
                `appliedDiscount: {
                    valueType:${bodyObject.discount.type},
                    value:${bodyObject.discount.amount}
                  }`
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
  res.json({ status: 200, createDraft });
}
