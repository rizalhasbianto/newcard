import { callShopify } from 'src/lib/shopify'

export default async function createCheckoutHandler(req, res) {
    const searchTerm = req.body?.search
    const query = `{
        products(first: 100, query: "title:${searchTerm}*") {
          pageInfo {
            hasNextPage
          }
          edges {
            cursor
            node {
              id
              title
              handle
              options {
                name
                values
              }
            }
          }
        }
    }`;

    const getProd = await callShopify(query);
  res.status(200).json({ newData: getProd })
}