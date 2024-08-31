import { adminAPi } from "src/lib/shopify";
import clientPromise from "src/lib/mongodb";

export default async function getOrders(req, res) {
  let querySession = "";
  let queryData = "";
  console.log("req.query", req.query)
  const statusQuery = req.query?.status ? JSON.parse(req.query?.status) : null
  if (req.query?.session === "sales") { 
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
  console.log("queryData", queryData)
  let hasNextPage = true;
  let totalOrders = 0;
  let cursor = "";
  while (hasNextPage) {
    const query = `{
            orders(first: 100,query:"(tag:b2b) ${querySession} ${queryData}" ${cursor}) {
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
