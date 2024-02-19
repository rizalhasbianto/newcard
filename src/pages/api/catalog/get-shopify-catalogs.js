import { adminAPi } from "src/lib/shopify";

export default async function getCollections(req, res) {
  const query = `{
    catalogs(first:100, query:"status:ACTIVE", type:COMPANY_LOCATION) {
          edges {
            node {
                id
                title
                status
                ... on CompanyLocationCatalog {
                  companyLocationsCount
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
                publication {
                    id
                }
            }
          }
        }
      }`;

  const resShopify = await adminAPi(query);

  const catalogs = resShopify.data.catalogs.edges.filter((item) => item.node.id.includes("CompanyLocationCatalog"))
  res.status(200).json({ newData: catalogs });
}
