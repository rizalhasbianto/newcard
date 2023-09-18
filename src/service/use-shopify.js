import { ClientRequest } from 'src/lib/ClientRequest'

export const syncQuoteToShopify =
    async (quoteId, quotesList, customerEmail, draftOrderId) => {
        const lineItems = quotesList.map((list) => {
            return (
                `{
              variantId: "${list.variant.id}",
              quantity: ${list.qty}
            }`
            )
        })

        const resSendToShopify = await ClientRequest(
            "/api/shopify/draft-order",
            "POST", {
            lineItems,
            poNumber: quoteId,
            customerEmail,
            draftOrderId
        })

        if (draftOrderId) {
            return {
                operation: "update",
                response: resSendToShopify
            }
        }

        return {
            operation: "create",
            response: resSendToShopify
        }
    }

export const sendInvoiceByShopify =
    async (id) => {
        const sendToShopify = await ClientRequest(
            "/api/shopify/draft-order-send",
            "POST", {
            id: id
        })
        return sendToShopify
    }