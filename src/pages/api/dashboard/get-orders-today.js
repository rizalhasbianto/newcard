import { restAPi } from "src/lib/shopify";
import clientPromise from "src/lib/mongodb";

import { month } from "src/data/date-range";

export default async function syncSales(req, res) {
  // Calculate total sales per month
  const utc = new Date().toJSON().slice(0,10);

  const resGetOrders = await restAPi(
    "orders.json",
    `status=open&created_at_min=${utc}T00:01:00-05:00&created_at_max=${utc}T00:00:00-05:00&fields=name,company,customer,current_subtotal_price`
  );

  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  const collection = "company";

  const companyData = resGetOrders.orders.map((itm) => itm.company && `${itm.company.id}`)
  const companyIds = companyData.filter(function (el) {
    return el != null;
  });

  const data = await db
    .collection(collection)
    .find({shopifyCompanyId:{ $in: companyIds }})
    .project({name:1, shopifyCompanyId:1})
    .sort({ _id:-1 })
    .limit(1)
    .toArray();

resGetOrders.orders.forEach((itm) => {
  if(itm.company) {
    const companyName = data.find((item) => item.shopifyCompanyId === `${itm.company.id}`)
    if(companyName) {
      itm.company.name = companyName.name
    }
  }
})
  res.json({ status: 200, data:resGetOrders }); 
}