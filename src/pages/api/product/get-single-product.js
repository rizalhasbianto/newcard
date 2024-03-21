import { adminAPi } from 'src/lib/shopify'

export default async function getSingleProduct(req, res) {
    const id = req.body?.id
    const company = req.body?.shopifyCompanyLocationID
    console.log(req.body)
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
                price
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
                company_${company}: contextualPricing(
                  context: { companyLocationId: "gid://shopify/CompanyLocation/${company}" }
                ) {
                    price {
                      amount
                    }
                }
              }
            }
          }
      }
    }`;
  const getProd = await adminAPi(query);
  getProd.data.product.variants.edges.forEach((itm) => {
    itm.node.companyPrice = {
      node : {
        [`company_${company}`]:itm.node[`company_${company}`],
        id: itm.node.id
      }
    }
  })
  res.status(200).json({ newData: getProd })
}