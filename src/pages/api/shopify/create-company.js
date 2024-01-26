import { adminAPi } from "src/lib/shopify";

export default async function shopify(req, res) {
  const bodyObject = req.body;

  let query;

  if (!bodyObject.shopifyCustomerId) {
    query = `
        mutation {
            companyCreate (
                input: {
                    company: {
                        name:"brownka"
                    }
                    companyLocation: {
                        billingAddress: {
                            address1:""
                            city:""
                            countryCode: "US"
                            zoneCode:"state"
                            zip:""
                        }
                        billingSameAsShipping: true
                    }
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

  const resCreateCompany= await adminAPi(query);
  res.json({ status: 200, resCreateCompany });
}
