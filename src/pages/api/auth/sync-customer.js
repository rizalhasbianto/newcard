import { adminAPi } from "src/lib/shopify";

export default async function syncCustomer(req, res) {
  const bodyObject = req.body;

  let query;

  if (!bodyObject.shopifyCustomerId) {
    query = `
        mutation {
            companyContactCreate (
                companyId:"gid://shopify/Company/${bodyObject.shopifyCompanyId}",
                input: {
                    email:"${bodyObject.email}",
                    firstName:"${bodyObject.firstName}", 
                    lastName:"${bodyObject.lastName}",
                    phone:"${bodyObject.phone}"
                }
            ) {
                companyContact {
                    id
                    customer {
                        id
                    }
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
                    phone:"${bodyObject.phone}"
                    id:"gid://shopify/Customer/${bodyObject.shopifyCustomerId}"
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
