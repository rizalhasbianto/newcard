import { adminAPi } from 'src/lib/shopify'
import clientPromise from "src/lib/mongodb";
import { collectionName } from "src/data/db-collection"

export default async function getOrders(req, res) {
    let cursor = ""
    let querySession = ""
    let filter = ""
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
      const collection = collectionName.companyTable;
      const data = await db
        .collection(collection)
        .find({"sales.id":req.query?.sessionSalesId})
        .project({ contact: 1 })
        .sort({ _id: -1 })
        .limit(100)
        .toArray();
        const customerIds = []
        data.map((items) => items.contact.map((item) => customerIds.push(`email:${item.email}`)))
        querySession = `AND (${customerIds.join(' OR ')})`
    }
    if(req.query?.session === "customer") {
      querySession = `AND email:${req.query?.sessionEmail}`
    }

    if(req.query?.search && req.query?.search !== "undefined") {
      querySession = querySession + `AND (name:${req.query?.search} OR default:${req.query?.search})`
    }

    const filterQuery = req.query?.filter && req.query?.filter !== "undefined" ? JSON.parse(req.query?.filter) : null
    if(filterQuery && filterQuery.financialStatus) {
      querySession = querySession + `AND (financial_status:${filterQuery.financialStatus}) `;
    }
    
    if (filterQuery && filterQuery.fulfillmentStatus) {
      querySession = querySession + `AND (fulfillment_status:${filterQuery.fulfillmentStatus}) `;
    }
    if (filterQuery && filterQuery.status) {
      querySession = querySession + `AND (status:${filterQuery.status}) `;
    }
    
    if (filterQuery && filterQuery.paymentStatus) {
      const savedSearchQuery = `{
          orderSavedSearches(first:100) {
              nodes{
                  id
                  name
              }
          }
      }`
      const resSavedSearch = await adminAPi(savedSearchQuery);
      const overDueSearchID = resSavedSearch.data.orderSavedSearches.nodes.find((itm) => itm.name === "Overdue")
      filter = `, savedSearchId:"${overDueSearchID.id}"`
    } else {
      filter = `, query:"(tag:b2b) ${querySession}"`
    }
    const query = `{
        orders(${param}: 10, reverse:true, ${filter} ${cursor}) {
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