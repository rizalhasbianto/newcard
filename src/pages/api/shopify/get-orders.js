import { adminAPi } from 'src/lib/shopify'

export default async function getOrders(req, res) {
    const searchTerm = req.query?.cursor
    const query = `{
        orders(first: 10, query:"tag:b2b") {
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
              updatedAt
            }
          }
        }
    }`;

  const resGetOrders = await adminAPi(query);
  res.status(200).json({ newData: resGetOrders })
}