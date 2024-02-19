import { adminAPi } from "src/lib/shopify";

export default async function shopify(req, res) {
  const bodyObject = req.body;

  const query = ` 
  mutation {
      companyCreate (
          input: {
              company: {
                  name:"${bodyObject.companyName}"
              }
              companyContact: {
                email:"${bodyObject.contactEmail}"
                firstName:"${bodyObject.contactFirstName}"
                lastName:"${bodyObject.contactLastName}"
              }
              companyLocation: {
                name:"${bodyObject.companyName}"
                shippingAddress: {
                    address1:"${
                      bodyObject.useAsShipping === "yes"
                        ? bodyObject.addressLocation
                        : bodyObject.addressShipping
                    }"
                    address2:""
                    city:"${
                      bodyObject.useAsShipping === "yes"
                        ? bodyObject.cityLocation
                        : bodyObject.cityShipping
                    }"
                    countryCode: US
                    zoneCode:"${
                      bodyObject.useAsShipping === "yes"
                        ? bodyObject.stateNameLocation.name
                        : bodyObject.stateNameShipping.name
                    }"
                    zip: "${
                      bodyObject.useAsShipping === "yes"
                        ? bodyObject.postalLocation
                        : bodyObject.postalShipping
                    }"
                }
                ${
                  bodyObject.useAsShipping === "yes"
                    ? `
                    billingSameAsShipping: true
                `
                    : `
                    billingAddress: {
                        address1:"${bodyObject.addressLocation}"
                        address2:""
                        city:"${bodyObject.cityLocation}"
                        countryCode: US
                        zoneCode:"${bodyObject.stateNameLocation.name}"
                        zip: "${bodyObject.postalLocation}"
                    }
                `
                }
              }
          }
      ) {
          company {
              id
              mainContact {
                customer {
                    id
                }
              }
          }
          userErrors {
              field
              message
          }
      }
  }
`;

  const resCreateCompany = await adminAPi(query);
  if (resCreateCompany.data.companyCreate.userErrors.length === 0) {
    console.log("resCreateCompany.data.companyCreate.company.id", resCreateCompany.data.companyCreate.company.id)
    const searchTerm = `query:"company_id:${resCreateCompany.data.companyCreate.company.id.replace("gid://shopify/Company/", "")}"`;
    const query = `{
    companyLocations(first:1, ${searchTerm}) {
          edges {
            node {
                id
            }
          }
        }
      }`;

    const getCompanyLocation = await adminAPi(query);
    console.log("getCompanyLocation.data.companyLocations", getCompanyLocation.data.companyLocations)
    resCreateCompany.data.companyCreate.company.locationID = getCompanyLocation.data.companyLocations.edges[0].node.id
  }
  res.json({ status: 200, data: resCreateCompany.data.companyCreate });
}
