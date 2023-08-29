import { ClientRequest } from 'src/lib/ClientRequest'

export const saveQuoteToMongoDb =
    async (companyName, shipTo, quotesList, status) => {
        const countSubtotal = quotesList.reduce((n, { total }) => n + total, 0)
        const tax = (countSubtotal * 0.1).toFixed(2)
        const total = Number(countSubtotal) + Number(tax)
        const today = new Date()
        const mongoRes = await ClientRequest(
            "/api/quotes/create-quote",
            "POST",
            {
                company: {
                    name: companyName,
                    shipTo: shipTo
                },
                quotesList: quotesList,
                quoteInfo: {
                    total: total,
                    item: quotesList.length
                },
                status: status,
                createdAt: today,
                updatedAt: "",
                DraftOrderId: ""
            }
        )
        return mongoRes
    }

    export const updateQuoteToMongoDb =
    async (quoteId, draftOrderId) => {
        const mongoRes = await ClientRequest(
            "/api/quotes/create-quote",
            "POST",
            {
                quoteId: quoteId,
                draftOrderId: draftOrderId
            }
        )
        return mongoRes
    }
