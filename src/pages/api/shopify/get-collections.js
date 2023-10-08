import { callShopify } from 'src/lib/shopify'

export default async function getCollections(req, res) {
    const searchTerm = req.query?.search ? `query:"title:${req.body?.search}*"` : "";
    const query = `{
        collections(first: 100, ${searchTerm}) {
          pageInfo {
            hasNextPage
          }
          edges {
            cursor
            node {
              id
              title
            }
          }
        }
    }`;

  const getCollections = await callShopify(query);
  
  res.status(200).json({ newData: getCollections })
}