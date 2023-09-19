import { adminAPi } from 'src/lib/shopify'

export default async function sendDraftOrder(req, res) {
    const bodyObject = req.body;
    const query = `
    mutation {
        draftOrderInvoiceSend(id:"${bodyObject.id}") {
          draftOrder {
            id
          }
          userErrors {
            field
            message
          }
        }
    }
    `;

  const sendDraft = await adminAPi(query);
  console.log(bodyObject.id)
  res.json({ status: 200, sendDraft });
}