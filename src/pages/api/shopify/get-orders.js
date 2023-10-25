import { adminAPi } from 'src/lib/shopify'

export default async function getOrders(req, res) {
    let cursor = ""
    let param = req.query?.page === "prev" ? "last ": "first"
    if(req.query?.page === "prev") {
      cursor = `, before: "${req.query?.startCursor}"`
    } 
    if(req.query?.page === "next") {
      cursor = `, after: "${req.query?.endCursor}"`
    }
    const query = `{
        orders(${param}: 10, query:"tag:b2b" ${cursor}) {
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
          edges {
            cursor
            node {
              id
              name
              poNumber
              customer{
                displayName
              }
              currentTotalPriceSet {
                shopMoney {
                    amount
                }
              }
              currentSubtotalLineItemsQuantity
              displayFinancialStatus
              displayFulfillmentStatus
              createdAt
            }
          }
        }
    }`;

  const resGetOrders = await adminAPi(query);
  res.status(200).json({ newData: resGetOrders.data.orders })
}