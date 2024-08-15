import { adminAPi } from 'src/lib/shopify'

export default async function getMultipleVariants(req, res) {
    const variantIDs = req.query?.variantIDs
    const shopifyCompanyLocationID = req.query?.shopifyCompanyLocationID
    const query = `{
      nodes(ids: ${variantIDs}) {
        ... on ProductVariant {
          id
          inventoryQuantity
          price
          company_${shopifyCompanyLocationID}: contextualPricing(
            context: { companyLocationId: "gid://shopify/CompanyLocation/${shopifyCompanyLocationID}" }
          ) {
            price {
              amount
            }
          }
        }
      }
    }`;
  const getProd = await adminAPi(query);
  res.status(200).json({ newData: getProd })
}