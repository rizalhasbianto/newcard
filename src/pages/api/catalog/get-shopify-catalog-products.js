import { adminAPi } from "src/lib/shopify";

export default async function shopify(req, res) {
  const query = `{
    catalog(id:"gid://shopify/CompanyLocationCatalog/29107912932") {
          id
          publication {
              id
              products(first:10) {
                pageInfo {
                  hasNextPage
                  startCursor
                  endCursor
                }
                edges {
                    node {
                        id
                        title
                        productType
                        vendor
                        contextualPricing(context:{companyLocationId:"gid://shopify/CompanyLocation/113246436"}) {
                          priceRange {
                            maxVariantPrice {
                              amount
                            }
                            minVariantPrice {
                              amount
                            }
                          }
                        }
                        featuredImage {
                          url: url(transform: { maxWidth: 270, preferredContentType:WEBP})
                        }
                        shopifyCatalog: metafield(namespace: "b2b", key: "catalog") { 
                          id
                          value
                          type
                        }
                        variants(first: 100) {
                          edges {
                            node {
                              id
                              title
                              contextualPricing(context:{companyLocationId:"gid://shopify/CompanyLocation/125272292"}) {
                                  price {
                                    amount
                                  }
                              }
                            }
                          }
                        }
                    }
                }    
              }
          }
        }
      }`;

  const resShopify = await adminAPi(query);
  res.status(200).json({ newData: resShopify });
}