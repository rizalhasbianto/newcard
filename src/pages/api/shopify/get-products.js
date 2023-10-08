import { callShopify } from 'src/lib/shopify'

export default async function getProducts(req, res) {
    const searchTerm = req.body?.search ? `query:"title:${req.body?.search}*"` : "";
    const query = `{
        products(first: 100, ${searchTerm}) {
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
        }
    }`;

  const getProd = await callShopify(query);
  res.status(200).json({ newData: getProd })
}