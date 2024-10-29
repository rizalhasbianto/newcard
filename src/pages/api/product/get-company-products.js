import { adminAPi } from "src/lib/shopify";

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
        {products(first:1) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              title
              productType
              handle
              tags
              vendor
              priceRangeV2 {
                maxVariantPrice {
                  amount
                }
                minVariantPrice {
                  amount
                }
              }
              options(first:100) {
                name
                  values
              }
              variants(first: 100) {
                nodes {
                  id
                  title
                  sku
                  price
                  inventoryQuantity
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
  }}`;
  };

  const resGetData = await adminAPi(query(productPerPage, searchTerm, cursor));
  const resData = resGetData;

  res.status(200).json({ newData: resData });
}
