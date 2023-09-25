import { usePostData } from 'src/lib/fetchData'

export const SyncQuoteToShopify =
    async (quoteId, quotesList, customerEmail, discount, draftOrderId) => {
        const lineItems = quotesList.map((list) => {
            return (
                `{
              variantId: "${list.variant.id}",
              quantity: ${list.qty}
            }`
            )
        })

        const resSendToShopify = await usePostData(
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

export const SendInvoiceByShopify =
    async (id) => {
        const sendToShopify = await usePostData(
            "/api/shopify/send-invoice",
            "POST",
            { id: id }
        )
        return sendToShopify
    }

export const GetProductsShopify =
    async (inputValue) => {
        const sendToShopify = await usePostData(
            "/api/shopify/get-products",
            "POST",
            { search: inputValue }
        )
        return sendToShopify
    }