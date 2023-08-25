import { callShopify } from 'src/lib/shopify'

export default async function getSingleProduct(req, res) {
    const id = req.body?.id
    const query = `{
      product(id: "${id}") {
          title
          description
          featuredImage {
            url : url(transform: { maxWidth: 570})
          }
          options {
            name
            values
          }
          priceRange {
            maxVariantPrice {
              amount
            }
            minVariantPrice {
              amount
            }
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
    }`;
  const getProd = await callShopify(query);
  res.status(200).json({ newData: getProd })
}