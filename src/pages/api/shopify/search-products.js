import { callShopify } from "src/lib/shopify";

export default async function getProducts(req, res) {
  const prodFilter = req.query.selectedFilter ? `, productFilters:${req.query.selectedFilter.replace(/"([^(")"]+)":/g,"$1:")}` : "";
  const gQl = `
    { search(
        first:10,
        types:PRODUCT, 
        query:""${prodFilter}
        ) {
            pageInfo {
                hasNextPage
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
              variants(first: 100) {
                edges {
                  node {
                    id
                    title
                    sku
                    currentlyNotInStock
                    price {
                      amount
                    }
                    selectedOptions {
                      name
                      value
                    }
                    image{
                      url: url(transform: { maxWidth: 270})
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
