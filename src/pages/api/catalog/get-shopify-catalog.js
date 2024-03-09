import { adminAPi } from "src/lib/shopify";
import clientPromise from "src/lib/mongodb";

export default async function shopify(req, res) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  const companyCollection = process.env.MONGODB_COLLECTION_COMPANY;
  const bodyObject = req.method === "POST" ? req.body : req.query;

  const query = `{
    catalog(id:"gid://shopify/CompanyLocationCatalog/${bodyObject.catalogID}") {
          id
          title
          ... on CompanyLocationCatalog {
            companyLocationsCount
            companyLocations(first:100) {
              edges {
                  node {
                      id
                      billingAddress {
                        address1
                        city
                        province
                        zip
                      }
                      company {
                          id
                          name
                          mainContact {
                              customer {
                                  email
                                  displayName
                              }
                          }
                      }
                      catalogs(first:10) {
                        edges {
                          node {
                            id
                            title
                          }
                        }
                      }
                  }
              }
            }
          }
          priceList {
            id
            name
            fixedPricesCount
            parent {
              adjustment {
                type
                value
              }
              settings {
                compareAtMode
              }
            }
          }
        }
      }`;

  const resShopify = await adminAPi(query); // get catalog from shopify

  // Get company detail from mongo based on shopify catalog
  if (resShopify.data.catalog) {
    const id = resShopify.data.catalog?.companyLocations.edges.map((item) =>
      item.node.id.replace("gid://shopify/CompanyLocation/", "")
    );

    const mongoRes = await db
      .collection(companyCollection)
      .find({ shopifyCompanyLocationId: { $in: id } })
      .limit(1000)
      .toArray();

    if (mongoRes) {
      resShopify.data.catalog.companyLocations.edges.forEach((item) => {
        const mongoCompany = mongoRes.find(
          (itemMongo) =>
            itemMongo.shopifyCompanyLocationId ===
            item.node.id.replace("gid://shopify/CompanyLocation/", "")
        );
        if (mongoCompany) {
          item.node.mongoCompany = {
            id: mongoCompany._id,
            sales: mongoCompany.sales,
          };
        } else {
          item.node.mongoCompany = "";
        }
      });
    }
  }

  res.status(200).json({ newData: resShopify });
}
