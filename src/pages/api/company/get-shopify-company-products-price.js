import { adminAPi } from "src/lib/shopify";

export default async function shopify(req, res) {
  const bodyObject = req.query;
  const prodListObject = JSON.parse(bodyObject.prodList)
  const company = JSON.parse(bodyObject.selectedCompany)
  const prodList = prodListObject.map((prod) =>
    prod.replace("gid://shopify/Product/", "")
  );
  const companyPriceQuery = prodList.map(
    (prod) => `
      prod_${prod}: product(id: "gid://shopify/Product/${prod}") {
        ${company.map(
          (comp) => `
          variants(first: 100) {
            edges {
              node {
                id
                company_${comp}: contextualPricing(
                  context: { companyLocationId: "gid://shopify/CompanyLocation/${comp}" }
                ) {
                    price {
                      amount
                    }
                }
              }
            }
          }
        `
        )}
      }
    `
  );
  const query = `{
      ${companyPriceQuery}
    }`;
  const resShopify = await adminAPi(query);
  res.status(200).json({ newData: resShopify });
}
