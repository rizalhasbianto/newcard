import { callShopify } from "src/lib/shopify";

export default async function getProducts(req, res) {
  const bodyObject = req.method === "POST" ? req.body : req.query;
  const cursor = bodyObject?.lastCursor ? `, after: "${bodyObject.lastCursor}"` : "";
  const productPerPage = bodyObject?.productPerPage ? bodyObject.productPerPage : 10;
  const pageIndex = bodyObject?.pageIndex ? bodyObject.pageIndex : 0;

  const searchTerm = bodyObject.queryParam
    ? `, query:"${bodyObject.queryParam
        .replace(/&/g, " AND ")
        .replace(/\+/g, " ")
        .replace(/=/g, ":")
        .replace("productType", "product_type")
        .replace("productVendor", "vendor")
        .replace("productName", "title")}"`
    : "";

  const query = (productPerPage, searchTerm, cursor) => {
    return `
        products(first: ${productPerPage} ${searchTerm}${cursor}) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            cursor
            node {
              id
              title
              productType
              handle
              tags
              vendor
              priceRange {
                maxVariantPrice {
                  amount
                }
                minVariantPrice {
                  amount
                }
              }
              options {
                name
                values
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
        }`;
  };

  let resData;
  if (!bodyObject?.collection) {
    const queryWithoutCollection = `{
      ${query(productPerPage, searchTerm, cursor)}
    }`;
    const resGetData = await callShopify(queryWithoutCollection);
    resData = resGetData.data.products;
  } else {
    let hasNextPage = true;
    let cursor = "";
    let ProdData = [];
    while (hasNextPage) {
      const queryWithCollection = `{
        collection(handle: "${bodyObject?.collection}") {
          handle
          ${query(100, "", cursor)}
        }
      }`;
      const resGetData = await callShopify(queryWithCollection);

      let resProdData = resGetData.data.collection.products.edges;

      if (bodyObject?.productName) {
        resProdData = resProdData.filter((prod) => prod.node.title.includes(bodyObject?.productName));
      }
      if (bodyObject?.productType) {
        resProdData = resProdData.filter((prod) => prod.node.productType === bodyObject?.productType);
      }
      if (bodyObject?.tag) {
        resProdData = resProdData.filter((prod) => prod.node.tags.includes(bodyObject?.tag));
      }
      if (bodyObject?.productVendor) {
        resProdData = resProdData.filter((prod) => prod.node.vendor === bodyObject?.productVendor);
      }
      
      resProdData.map((prod) => ProdData.push(prod));
      cursor = `, after: "${resGetData.data.collection.products.edges.at(-1).cursor}"`;
      hasNextPage = resGetData.data.collection.products.pageInfo.hasNextPage;
    }

    if (pageIndex > 0) {
      const reqProd = ProdData.slice(
        pageIndex * productPerPage,
        pageIndex * productPerPage + productPerPage
      );
      resData = {
        pageInfo: {
          hasNextPage: ProdData.length > productPerPage ? true : false,
        },
        edges: reqProd,
      };
    } else {
      const totalLength = ProdData.length;
      const reqProd = ProdData.slice(0, productPerPage);
      resData = {
        pageInfo: {
          hasNextPage: totalLength > productPerPage ? true : false,
        },
        edges: reqProd,
      };
    }
  }

  res.status(200).json({ newData: resData });
}
