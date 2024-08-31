import { restAPi } from "src/lib/shopify";
import clientPromise from "src/lib/mongodb";

import { month } from "src/data/date-range";

export default async function syncSales(req, res) {
  // Calculate total sales per month
  let salesPerMonth = [];
  await Promise.all(
    month.map(async (itm) => {
      const resGetOrders = await restAPi(
        "orders.json",
        `status=closed&created_at_min=${itm.created_at_min}&created_at_max=${itm.created_at_max}&fields=current_subtotal_price&financial_status=paid`
      );
      let totalSale = 0;
      resGetOrders.orders.forEach((element) => {
        const sale = parseFloat(element.current_subtotal_price);
        totalSale += sale;
      });
      salesPerMonth.push({ month: itm.month, sales: totalSale.toFixed(2) });
    })
  );

  // save data to mongo
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  const collection = "report"
  await db.collection(collection).insertOne({sales:salesPerMonth});

  res.json({ status: 200, data:"success" }); 
}
