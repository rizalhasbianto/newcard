import { callShopify } from "src/lib/shopify";
import { adminAPi } from "src/lib/shopify";

export default async function getProducts(req, res) {
  const productPerPage = req.query.productPerPage ? req.query.productPerPage : 10;
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
                    handle
                    featuredImage {
                      url
                    }
                  }
                }
            }
        }
    }`;

  const resGetData = await callShopify(query);
  if (resGetData) {
    const prodList = resGetData.data.search.edges.map((prod) =>
      prod.node.id.replace("gid://shopify/Product/", "")
    );
    let chunkSize = 5;
    let chunksProducts = [];
    while (prodList.length > 0) {
      chunksProducts.push(prodList.splice(0, chunkSize));
    }
    const companyPriceQuery = chunksProducts.map((prod) =>
      prod.map(
        (itm) => `
        prod_${itm}: product(id: "gid://shopify/Product/${itm}") {
          variants(first:100) {
            edges {
                node {
                    title
                    sku
                    inventoryItem {
                        inventoryLevel(locationId:"gid://shopify/Location/71640547556") {
                            quantities(names:["incoming","on_hand","available","committed"]) {
                                name
                                quantity
                                updatedAt
                            }
                            scheduledChanges(first:100) {
                                nodes {
                                    expectedAt
                                    quantity
                                }
                            }
                        }
                    }
                }
            }
                    
          }
        }
      `
      )
    );

    await Promise.all(
      companyPriceQuery.map(async (itm) => {
        const query = `{${itm}}`;
        const resShopify = await adminAPi(query);
        resGetData.data.search.edges.forEach((dta) => {
          const prodVariants =
            resShopify.data[`prod_${dta.node.id.replace("gid://shopify/Product/", "")}`];
          if (prodVariants) {
            dta.node.variants = prodVariants.variants;
          }
        });
      })
    );
  }

  res.status(200).json({ newData: resGetData.data.search });
}
