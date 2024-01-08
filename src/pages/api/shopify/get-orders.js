import { adminAPi } from 'src/lib/shopify'
import clientPromise from "src/lib/mongodb";

export default async function getOrders(req, res) {
    let cursor = ""
    let querySession = ""
    let param = req.query?.page === "prev" ? "last ": "first"
    if(req.query?.page === "prev") {
      cursor = `, before: "${req.query?.startCursor}"`
    } 
    if(req.query?.page === "next") {
      cursor = `, after: "${req.query?.endCursor}"`
    }
    if(req.query?.session === "sales") {
      const client = await clientPromise;
      const db = client.db(process.env.DB_NAME);
      const collection = process.env.MONGODB_COLLECTION_COMPANY;
      const data = await db
        .collection(collection)
        .find({})
        .project({ contact: 1 })
        .sort({ _id: -1 })
        .limit(100)
        .toArray();
        const customerIds = []
        data.map((items) => items.contact.map((item) => customerIds.push(`email:${item.email}`)))
        querySession = `AND (${customerIds.join(' OR ')})`
    }
    if(req.query?.session === "customer") {
      querySession = `AND email:${req.query?.sessionId}`
    }
    
    const query = `{
        orders(${param}: 10, reverse:true, query:"(tag:b2b) ${querySession}" ${cursor}) {
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