import { ClientRequest } from 'src/lib/ClientRequest'

export const syncQuoteToShopify =
    async (quoteId,quotesList,customerEmail) => {
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
            poNumber: quoteId,
            customerEmail
        })
        return sendToShopify
    }

    export const sendInvoiceByShopify =
    async (id) => {
        const sendToShopify = await ClientRequest(
            "/api/shopify/draft-order-send",
            "POST", {
            id:id
        })
        return sendToShopify
    }