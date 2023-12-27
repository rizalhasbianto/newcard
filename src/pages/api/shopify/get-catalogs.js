import { adminAPi } from "src/lib/shopify";

export default async function getCollections(req, res) {
  const searchTerm = req.query?.search ? `query:"title:${req.body?.search}*"` : "";
  const query = `{
        catalogs(first:100) {
          edges {
            node {
                id
                priceList {
                    id
                    name
                }
                publication {
                    id
                    products(first:2) {
                        edges {
                            node {
                                id
                                title
                            }
                        }    
                    }
                }
                title
            }
          }
        }
      }`;

  const getCollections = await adminAPi(query);
  res.status(200).json({ newData: getCollections });
}
