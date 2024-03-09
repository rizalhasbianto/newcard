import { adminAPi } from "src/lib/shopify";

export default async function shopify(req, res) {
  const bodyObject = req.method === "POST" ? req.body : req.query;
  const queryMap = bodyObject.productsList.map(
    (item) => `
      prod_${item.id}: priceList(id:"${bodyObject.priceListID}") {
        prices(first:100, query: "product_id:${item.id}") {
          edges {
            node {
              originType
              price {
                amount
              }
            }
          }
        }
      }
    `
  );
  const query = `{
    ${queryMap}
  }`;

  const resShopify = await adminAPi(query);
  res.status(200).json({ newData: resShopify });
}
