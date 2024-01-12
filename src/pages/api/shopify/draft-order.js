import { adminAPi } from "src/lib/shopify";

export default async function createDraftOrder(req, res) {
  const bodyObject = req.body;
  const name = bodyObject.companyBill.contact && bodyObject.companyBill.contact.detail.name.split(" ");
  const firstName = name && name[0];
  const lastName = name && name[1];
  let query;

  if (bodyObject.draftOrderId) {
    query = `
      mutation {
        draftOrderUpdate(
          id: "${bodyObject.draftOrderId}",
          input: {
            email: "${bodyObject.companyBill.contact.detail.email}",
            billingAddress: {
              address1:"${bodyObject.companyBill.location.address}",
              city:"${bodyObject.companyBill.location.city}",
              company:"${bodyObject.companyBill.name}",
              countryCode:US,
              firstName:"${firstName}"
              lastName:"${lastName}",
              phone:"${bodyObject.companyBill.contact.detail.phone}",
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
              phone:"${bodyObject.companyBill.contact.detail.phone}",
              provinceCode:"${bodyObject.companyBill.location.state}",
              zip:"${bodyObject.companyBill.location.zip}"
            }
            lineItems: [${bodyObject.lineItems}],
            poNumber: "${bodyObject.poNumber}",
            tags:"b2b",
            ${
              bodyObject.payment.id
                ? `paymentTerms: {
                paymentTermsTemplateId:"${bodyObject.payment.id}",
                ${
                  bodyObject.payment.date
                    ? `
                 paymentSchedules: {
                  ${
                    bodyObject.payment.id === "gid://shopify/PaymentTermsTemplate/7"
                      ? `dueAt:"${bodyObject.payment.date}"`
                      : `issuedAt:"${bodyObject.payment.date}"`
                  }
                }
                `
                    : ""
                }
              },`
                : `paymentTerms: {
                    paymentTermsTemplateId:"gid://shopify/PaymentTermsTemplate/1"
                  },
                `
            }
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
              invoiceUrl
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
              email: "${bodyObject.companyBill.contact.detail.email}",
              billingAddress: {
                address1:"${bodyObject.companyBill.location.address}",
                city:"${bodyObject.companyBill.location.city}",
                company:"${bodyObject.companyBill.name}",
                countryCode:US,
                firstName:"${firstName}"
                lastName:"${lastName}",
                phone:"${bodyObject.companyBill.contact.detail.phone}",
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
                phone:"${bodyObject.companyBill.contact.detail.phone}",
                provinceCode:"${bodyObject.companyBill.location.state}",
                zip:"${bodyObject.companyBill.location.zip}"
              }
              lineItems: [${bodyObject.lineItems}],
              poNumber: "${bodyObject.poNumber}",
              tags:"b2b",
              ${
                bodyObject.payment.id &&
                `paymentTerms: {
                  paymentTermsTemplateId:"${bodyObject.payment.id}",
                  ${
                    bodyObject.payment.date ?
                    `
                    paymentSchedules: {
                      ${
                        bodyObject.payment.id === "gid://shopify/PaymentTermsTemplate/7"
                          ? `dueAt:"${bodyObject.payment.date}"`
                          : `issuedAt:"${bodyObject.payment.date}"`
                      }
                    }
                  `
                  :""
                  }
                },`
              }
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
              invoiceUrl
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
