import { adminAPi, callShopify } from "src/lib/shopify";

const getCatalogsProducts = async (catalogId) => {
  let hasNext = true;
  let productsAllData = [];
  let cursor;
  while (hasNext) {
    const query = `{
        catalog(id:"gid://shopify/CompanyLocationCatalog/${catalogId}") {
                publication {
                    products(first:100, ${cursor ? `after:"${cursor}"` : ""}) {
                    pageInfo {
                        hasNextPage
                        endCursor
                    }
                    edges {
                        node {
                            id
                            shopifyCatalog: metafield(namespace: "b2b", key: "catalog") { 
                              id
                              value
                              type
                            }
                        }
                    }    
                    }
                }
            }
        }`;
    const resShopify = await adminAPi(query);
    const productsData = resShopify.data.catalog.publication.products;
    console.log("productsData", productsData.edges.length)
    cursor = productsData.pageInfo.endCursor;
    productsAllData.push(...productsData.edges);
    if (!productsData.pageInfo.hasNextPage) {
      hasNext = false;
    }
  }

  return productsAllData;
};

const getSyncedProducts = async (catalogId) => {
  let hasNext = true;
  let productsAllData = [];
  let cursor;
  while (hasNext) {
    const query = ` {
        search(
          types:PRODUCT, 
          first:10,
          query:""
          productFilters:[{productMetafield:{namespace:"b2b", key:"catalog", value:"${catalogId}"}}],
          ${cursor ? `after:"${cursor}"` : ""}
          ) {
              pageInfo {
                hasNextPage
                endCursor
              }
              edges{  
                  node {
                    ... on Product {
                      id
                      shopifyCatalog: metafield(namespace: "b2b", key: "catalog") { 
                        id
                        value
                        type
                      }
                    }
                  }
              }
            }
        }`;
    const resShopify = await callShopify(query);
    const productsData = resShopify.data.search;
    cursor = productsData.pageInfo.endCursor;
    productsAllData.push(...productsData.edges);
    if (!productsData.pageInfo.hasNextPage) {
      hasNext = false;
    }
  }

  return productsAllData;
};

export default async function shopify(req, res) {
  const bodyObject = req.method === "POST" ? req.body : req.query
  const resCatalogsProduct = await getCatalogsProducts(bodyObject.catalogID);
  const resSyncedProducts = await getSyncedProducts(bodyObject.catalogID);
  const newId = resCatalogsProduct.filter(
    (item) => !resSyncedProducts.some((data) => data.node.id === item.node.id)
  );
  const removeId = resSyncedProducts.filter(
    (item) => !resCatalogsProduct.some((data) => data.node.id === item.node.id)
  );
  const totalProducts = resCatalogsProduct.length
  const syncData = {
    removeId,
    newId,
    totalProducts
  };
  res.status(200).json({ newData: syncData });
}