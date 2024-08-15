import { adminAPi } from "src/lib/shopify";

export default async function getInventory(req, res) {
    let cursor = ""
    let param = req.query?.page === "prev" ? "last": "first"
    if(req.query?.page === "prev") {
      cursor = `, before: "${req.query?.startCursor}"`
    } 
    if(req.query?.page === "next") {
      cursor = `, after: "${req.query?.endCursor}"`
    }
  const query = `
    {
        inventoryItems(${param}: 10${cursor}) {
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
              }
            edges {
                node {
                    id
                    duplicateSkuCount
                    tracked
                    inventoryLevels(first: 10) {
                        edges {
                            node {
                                id
                                quantities(names:["incoming","on_hand","available","committed"]) {
                                    name
                                    quantity
                                    updatedAt
                                }
                                location {
                                    name
                                }
                                scheduledChanges(first:100) {
                                    nodes {
                                        expectedAt
                                    }
                                }
                            }
                        }    
                    
                    }
                    variant {
                        displayName
                        price
                        sku
                        product {
                            handle
                        }
                    }
                }
            }
        }
    }  
      `

const resData = await adminAPi(query);
res.status(200).json({ newData: resData.data.inventoryItems });
}
