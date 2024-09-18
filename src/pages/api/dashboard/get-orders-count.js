import { adminAPi } from "src/lib/shopify";
import clientPromise from "src/lib/mongodb";
import { collectionName } from "src/data/db-collection"

export default async function getOrders(req, res) {
  let querySession = "";
  let queryData = "";
  let filter = "";
  const statusQuery = req.query?.status ? JSON.parse(req.query?.status) : null
  if (req.query?.session === "sales") { 
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const collection = collectionName.companyTable;
    const data = await db
      .collection(collection)
      .find({})
      .project({ contact: 1 })
      .sort({ _id: -1 })
      .limit(100)
      .toArray();
    const customerIds = [];
    data.map((items) => items.contact.map((item) => customerIds.push(`email:${item.email}`)));
    querySession = `AND (${customerIds.join(" OR ")})`;
  }

  if (req.query?.search && req.query?.search !== "undefined") {
    querySession = `AND (name:${req.query?.search} OR default:${req.query?.search})`;
  }
  if (statusQuery && statusQuery.financial_status) {
    queryData = queryData + `AND (financial_status:${statusQuery.financial_status}) `;
  }
  if (req.query?.fulfillment_status) {
    queryData = queryData + `AND (fulfillment_status:${statusQuery.fulfillment_status}) `;
  }
  if (req.query?.status) {
    queryData = queryData + `AND (status:${statusQuery.status}) `;
  }

  if (req.query?.status && statusQuery.paymentStatus) {
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
    filter = `, query:"(tag:b2b) ${querySession} ${queryData}"`
  }

  let hasNextPage = true;
  let totalOrders = 0;
  let cursor = "";
  while (hasNextPage) {
    const query = `{
            orders(first: 100 ${filter} ${cursor}) {
              pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
              }
              edges {
                node {
                  id
                }
              }
            }
        }`;

    const resGetOrders = await adminAPi(query);
    totalOrders += resGetOrders.data.orders.edges.length;
    hasNextPage = resGetOrders.data.orders.pageInfo.hasNextPage;
    if (hasNextPage) {
      cursor = `, after: "${resGetOrders.data.orders.pageInfo.endCursor}"`;
    }
  }

  res.status(200).json({ newData: { orderCount: totalOrders } });
}
