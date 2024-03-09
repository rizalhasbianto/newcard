import { adminAPi } from "src/lib/shopify";

export default async function shopify(req, res) {
  const query = `
  {
    product(id: "gid://shopify/Product/8019406094564") {
      company_113246436: contextualPricing(
        context: { companyLocationId: "gid://shopify/CompanyLocation/171802852" }
      ) {
        priceRange {
          maxVariantPrice {
            amount
          }
          minVariantPrice {
            amount
          }
        }
      }
    }
  }`;

  const resShopify = await adminAPi(query);
  res.status(200).json({ newData: resShopify });
}
