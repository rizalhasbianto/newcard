import { adminAPi } from "src/lib/shopify";

export default async function getInventory(req, res) {
    console.log("req.query.productHandle", req.query.productHandle)
    const query = `
        {
            productByHandle(handle: "${req.query.productHandle}") {
                variants(first:100) {
                    edges {
                        node {
                            title
                            inventoryItem {
                                inventoryLevel(locationId:"gid://shopify/Location/71640547556") {
                                    quantities(names:["incoming","on_hand","available","committed"]) {
                                        name
                                        quantity
                                        updatedAt
                                    }
                                    scheduledChanges(first:100) {
                                        nodes {
                                            expectedAt
                                        }
                                    }
                                }
                            }
                        }
                    }
                            
                }
            }
        } 
    `;

  const resData = await adminAPi(query);
  res.status(200).json({ newData: resData });
}
