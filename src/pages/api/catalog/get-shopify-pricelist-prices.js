import { adminAPi } from "src/lib/shopify";

export default async function shopify(req, res) {
  const bodyObject = req.body ? req.body : req.query;
  const queryMap = bodyObject.map(
    (item) => `
      prod_${item.id}: priceList(id:"gid://shopify/PriceList/20011974884") {
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
