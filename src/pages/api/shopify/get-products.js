import { callShopify } from "src/lib/shopify";

export default async function getProducts(req, res) {
  const searchByTitle = req.body?.prodName ? `title:${req.body.prodName}*` : "";
  const searchByType = req.body?.prodType ? `AND product_type:${req.body.prodType}` : "";
  const searchByTag = req.body?.prodTag ? `AND tag:${req.body.prodTag}` : "";
  const searchByVendor = req.body?.prodVendor ? `AND vendor:${req.body.prodVendor}` : "";
  const cursor = req.body?.lastCursor ? `, after: "${req.body.lastCursor}"` : "";
  const productPerPage = req.body?.productPerPage ? req.body.productPerPage : 100;
  const lodMoreCount = req.body?.lodMoreCount ? req.body.lodMoreCount : 0;
  const searchTerm = req.body
    ? `, query:"${searchByTitle} ${searchByType} ${searchByTag} ${searchByVendor}" ${cursor}`
    : "";

  const query = (productPerPage, searchTerm, cursor) => {
    return `
        products(first: ${productPerPage} ${searchTerm}${cursor}) {
          pageInfo {
            hasNextPage
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
    console.log("resGetData", queryWithoutCollection)
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
        resProdData = resProdData.filter((prod) => prod.node.title.includes(req.body?.prodName));
      }
      if (searchByType) {
        resProdData = resProdData.filter((prod) => prod.node.productType === req.body?.prodType);
      }
      if (searchByTag) {
        resProdData = resProdData.filter((prod) => prod.node.tags.includes(req.body?.prodTag));
      }
      if (searchByVendor) {
        resProdData = resProdData.filter((prod) => prod.node.vendor === req.body?.prodVendor);
      }

      resProdData.map((prod) => ProdData.push(prod));
      cursor = `, after: "${resGetData.data.collection.products.edges.at(-1).cursor}"`;
      hasNextPage = resGetData.data.collection.products.pageInfo.hasNextPage;
    }

    if (lodMoreCount > 0) {
      const reqProd = ProdData.slice(
        lodMoreCount * productPerPage,
        lodMoreCount * productPerPage + productPerPage
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
