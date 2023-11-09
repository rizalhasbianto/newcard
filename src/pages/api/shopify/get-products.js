import { callShopify } from "src/lib/shopify";

export default async function getProducts(req, res) {
  const searchByTitle = req.body?.productName ? `title:${req.body.productName}*` : "";
  const searchByType = req.body?.productType ? `product_type:${req.body.productType}` : "";
  const searchByTag = req.body?.tag ? `AND tag:${req.body.tag}` : "";
  const searchByVendor = req.body?.productVendor ? `AND vendor:${req.body.productVendor}` : "";
  const cursor = req.body?.lastCursor ? `, after: "${req.body.lastCursor}"` : "";
  const productPerPage = req.body?.productPerPage ? req.body.productPerPage : 100;
  const pageIndex = req.body?.pageIndex ? req.body.pageIndex : 0;

  const searchTerm = req.body.queryParam
    ? `, query:"${req.body.queryParam
        .replace(/&/g, " AND ")
        .replace(/\+/g, " ")
        .replace(/=/g, ":")
        .replace("productType", "product_type")
        .replace("productVendor", "vendor")
        .replace("productName", "title")}" ${cursor}`
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
        }`;
  };

  let resData;
  if (!req.body?.collection) {
    const queryWithoutCollection = `{
      ${query(productPerPage, searchTerm, "")}
    }`;
    const resGetData = await callShopify(queryWithoutCollection);
    resData = resGetData.data.products;
  } else {
    let hasNextPage = true;
    let cursor = "";
    let ProdData = [];
    while (hasNextPage) {
      const queryWithCollection = `{
        collection(handle: "${req.body?.collection}") {
          handle
          ${query(100, "", cursor)}
        }
      }`;
      const resGetData = await callShopify(queryWithCollection);
      
      let resProdData = resGetData.data.collection.products.edges;

      if (searchByTitle) {
        resProdData = resProdData.filter((prod) => prod.node.title.includes(req.body?.productName));
      }
      if (searchByType) {
        resProdData = resProdData.filter((prod) => prod.node.productType === req.body?.productType);
      }
      if (searchByTag) {
        resProdData = resProdData.filter((prod) => prod.node.tags.includes(req.body?.tag));
      }
      if (searchByVendor) {
        resProdData = resProdData.filter((prod) => prod.node.vendor === req.body?.productVendor);
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
