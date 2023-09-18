import { fetchData } from 'src/lib/fetchData'

export const syncQuoteToShopify =
    async (quoteId, quotesList, customerEmail, discount, draftOrderId) => {
        const lineItems = quotesList.map((list) => {
            return (
                `{
              variantId: "${list.variant.id}",
              quantity: ${list.qty}
            }`
            )
        })

        const resSendToShopify = await fetchData(
            "/api/shopify/draft-order",
            "POST", {
            lineItems,
            poNumber: quoteId,
            customerEmail,
            discount,
            draftOrderId,
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
        const sendToShopify = await fetchData(
            "/api/shopify/send-invoice",
            "POST", {
            id: id
        })
        return sendToShopify
    }