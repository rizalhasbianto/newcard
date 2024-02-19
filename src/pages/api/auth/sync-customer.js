import { adminAPi } from "src/lib/shopify";

export default async function syncCustomer(req, res) {
  const bodyObject = req.body;

  let query;

  if (!bodyObject.shopifyCustomerId) {
    query = `
        mutation {
            customerCreate (
                input: {
                    email:"${bodyObject.email}",
                    firstName:"${bodyObject.firstName}", 
                    lastName:"${bodyObject.lastName}",
                }
            ) {
                customer {
                    id
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
            customerUpdate (
                input: {
                    email:"${bodyObject.email}",
                    firstName:"${bodyObject.firstName}",
                    lastName:"${bodyObject.lastName}",
                    id:"${bodyObject.shopifyCustomerId}"
                }
            ) {
                customer {
                    id
                }
                userErrors {
                    field
                    message
                }
            }
        }
      `;
  }

  const resSyncCustomer = await adminAPi(query);
  console.log(resSyncCustomer)
  res.json({ status: 200, resSyncCustomer });
}
