import { callShopify } from "src/lib/shopify";

export default async function getProducts(req, res) {
  const productPerPage = req.query.productPerPage ? req.query.productPerPage : 12;
  const productName = req.query.productName ? req.query.productName : "";

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
console.log("cursor", cursor(req.query, productPerPage))
  const gQl = `
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
                          image{
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

  const resGetData = await callShopify(gQl);
  res.status(200).json({ newData: resGetData.data.search });
}
