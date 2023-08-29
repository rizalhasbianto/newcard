import { ClientRequest } from 'src/lib/ClientRequest'

export const syncQuoteToShopify =
    async (mongoReponse,quotesList, status) => {
        const lineItems = quotesList.map((list) => {
            return (
                `{
              variantId: "${list.variant.id}",
              quantity: ${list.qty}
            }`
            )
        })
        const sendToShopify = await ClientRequest(
            "/api/shopify/draft-order-create",
            "POST", {
            lineItems,
            poNumber: mongoReponse?.data.insertedId,
        })
        return sendToShopify
    }

    export const sendDraftOrderByShopify =
    async (email,id) => {
        const sendToShopify = await ClientRequest(
            "/api/shopify/draft-order-send",
            "POST", {
            email:email,
            id:id
        })
        return sendToShopify
    }