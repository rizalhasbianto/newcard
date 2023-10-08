import { callShopify, adminAPi } from 'src/lib/shopify'

export default async function getCollections(req, res) {
    const searchTerm = req.query?.search ? `query:"title:${req.body?.search}*"` : "";
    const query = `{
      shop {
        productVendors(first: 200) {
          edges {
            node
          }
        }
      }
    }`;

  const getCollections = await adminAPi(query);
  res.status(200).json({ newData: getCollections })
}