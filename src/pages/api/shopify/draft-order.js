import { adminAPi } from "src/lib/shopify";

export default async function createDraftOrder(req, res) {
  const bodyObject = req.body;
  const name = bodyObject.companyBill.contact && bodyObject.companyBill.contact.name.split(" ")
  const firstName = name && name[0]
  const lastName = name && name[1]
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
              email: "${bodyObject.companyBill.contact.email}",
              billingAddress: {
                address1:"${bodyObject.companyBill.location.address}",
                city:"${bodyObject.companyBill.location.city}",
                company:"${bodyObject.companyBill.name}",
                countryCode:US,
                firstName:"${firstName}"
                lastName:"${lastName}",
                phone:"${bodyObject.companyBill.contact.phone}",
                provinceCode:"${bodyObject.companyBill.location.state}",
                zip:"${bodyObject.companyBill.location.zip}"
              },
              shippingAddress: {
                address1:"${bodyObject.companyBill.location.address}",
                city:"${bodyObject.companyBill.location.city}",
                company:"${bodyObject.companyBill.name}",
                countryCode:US,
                firstName:"${firstName}"
                lastName:"${lastName}",
                phone:"${bodyObject.companyBill.contact.phone}",
                provinceCode:"${bodyObject.companyBill.location.state}",
                zip:"${bodyObject.companyBill.location.zip}"
              }
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
  console.log("createDraft", createDraft)
  res.json({ status: 200, createDraft });
}
