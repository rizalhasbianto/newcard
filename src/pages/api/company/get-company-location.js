import { adminAPi } from "src/lib/shopify";

export default async function callShopify(req, res) {
  if (req.query?.companyID) {
    res.status(500);
  }

  const searchTerm = req.query?.companyID
    ? `query:"company_id:gid://shopify/Company/168526052"`
    : "";
  const query = `{
    companyLocations(first:1, query:"company_id:168526052") {
          edges {
            node {
                id
                name
            }
          }
        }
      }`;

  const getCompanyLocation = await adminAPi(query);
  res.status(200).json({ newData: getCompanyLocation });
}
