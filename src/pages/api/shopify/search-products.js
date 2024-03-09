import { callShopify } from "src/lib/shopify";
import { adminAPi } from "src/lib/shopify";

export default async function getProducts(req, res) {
  const productPerPage = req.query.productPerPage ? req.query.productPerPage : 12;
  const productName = req.query.productName ? req.query.productName : "";
  const company = JSON.parse(req.query.company);
  console.log("company", company)
  const cursor = (cursor, productPerPage) => {
    if (cursor?.lastCursor) {
      return `, first:${productPerPage}, after: "${req.query.lastCursor}"`;
    }
    if (cursor?.firstCursor) {
      return `, last:${productPerPage}, before: "${req.query.firstCursor}"`;
    }
    return `, first:${productPerPage}`;
  };

  const prodFilter = req.query.selectedFilter
    ? `, productFilters:${req.query.selectedFilter.replace(/"([^(")"]+)":/g, "$1:")}`
    : "";

  const query = `
    { search(
        types:PRODUCT, 
        query:"${productName}"${prodFilter}${cursor(req.query, productPerPage)}
        ) {
            pageInfo {
              hasNextPage
              startCursor
              endCursor
            }
            totalCount
            productFilters {
                label
                values {
                    count
                    label
                }
            }
            edges{  
                node {
                  ... on Product {
                    id
                    title
                    productType
                    handle
                    tags
                    vendor
                    options {
                      name
                      values
                    }
                    priceRange {
                      maxVariantPrice {
                        amount
                      }
                      minVariantPrice {
                        amount
                      }
                    }
                    variants(first: 100) {
                      edges {
                        node {
                          id
                          title
                          sku
                          currentlyNotInStock
                          quantityAvailable
                          price {
                            amount
                          }
                          selectedOptions {
                            name
                            value
                          }
                          image {
                            url: url(transform: { maxWidth: 270, preferredContentType:WEBP})
                          }
                          product {
                            id
                          }
                        }
                      }
                    }
                  }
                }
            }
        }
    }`;

  const resGetData = await callShopify(query);
  if (resGetData && company && company.length > 0) {
    const prodList = resGetData.data.search.edges.map((prod) =>
      prod.node.id.replace("gid://shopify/Product/", "")
    );
    const companyPriceQuery = prodList.map(
      (prod) => `
      prod_${prod}: product(id: "gid://shopify/Product/${prod}") {
        ${company.map(
          (comp) => `
          company_${comp}: contextualPricing(
            context: { companyLocationId: "gid://shopify/CompanyLocation/${comp}" }
          ) {
              priceRange {
                maxVariantPrice {
                  amount
                }
                minVariantPrice {
                  amount
                }
              }
            }
        `
        )}
      }
    `
    );
    const query = `{
      ${companyPriceQuery}
    }`;
    const resShopify = await adminAPi(query)
    resGetData.data.search.edges.forEach((itm) => {
      const price =
        resShopify.data[
          `prod_${itm.node.id.replace("gid://shopify/Product/", "")}`
        ];
        itm.node.companyPrice = price
    })
  }
  res.status(200).json({ newData: resGetData.data.search });
}
