import { callShopify } from "src/lib/shopify";

export default async function getProducts(req, res) {
  const query = `
    {productByHandle(handle:"${req.query.productHandle}") {
              id
              title
              productType
              handle
              tags
              description
              vendor
              priceRange {
                maxVariantPrice {
                  amount
                }
              }
              options {
                name
                values
              }
              images(first: 100) {
                edges {
                  node {
                      url: url(transform: { maxWidth: 100, preferredContentType:WEBP})
                      bigUrl: url(transform: { maxWidth: 500, preferredContentType:WEBP})
                  }
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
                      url: url(transform: { maxWidth: 100, preferredContentType:WEBP})
                      bigUrl: url(transform: { maxWidth: 500, preferredContentType:WEBP})
                    }
                    product {
                      id
                    }
                  }
                }
              }
            }
        }`;

  const resGetData = await callShopify(query);

  res.status(200).json({ newData: resGetData.data.productByHandle });
}
