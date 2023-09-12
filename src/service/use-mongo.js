import { ClientRequest } from 'src/lib/ClientRequest'

export const getQuotesData =
    async (page, rowsPerPage, query, sort) => {
        const quotesRes = await ClientRequest(
            "/api/quotes/get-quotes",
            "POST",
            {
                page: page,
                postPerPage: rowsPerPage,
                query: query,
                sort: sort
            }
        )

        return quotesRes
    }
export const saveQuoteToMongoDb =
    async (
        companyName,
        shipTo,
        quotesList,
        status,
        quoteId
    ) => {
        const countSubtotal = quotesList.reduce((n, { total }) => n + total, 0)
        const tax = (countSubtotal * 0.1).toFixed(2)
        const total = Number(countSubtotal) + Number(tax)
        const today = new Date()
        const mongoRes = await ClientRequest(
            "/api/quotes/update-quote",
            "POST",
            {
                quoteId: quoteId,
                data: {
                    company: {
                        name: companyName,
                        shipTo: shipTo
                    },
                    quotesList: quotesList || [],
                    quoteInfo: {
                        total: total,
                        item: quotesList.length
                    },
                    status: status,
                    createdAt: today,
                    updatedAt: "",
                    DraftOrderId: ""
                }
            }
        )
        return mongoRes
    }

export const addNewQuoteToMongoDb =
    async () => {
        const today = new Date()
        const mongoRes = await ClientRequest(
            "/api/quotes/create-quote",
            "POST",
            {
                company: {
                    name: "",
                    shipTo: ""
                },
                quotesList: [],
                quoteInfo: {
                    total: "",
                    item: 0
                },
                status: "new",
                createdAt: today,
                updatedAt: "",
                DraftOrderId: ""
            }
        )
        return mongoRes
    }

export const updateOrderIdQuoteToMongoDb =
    async (quoteId, draftOrderId) => {
        const mongoRes = await ClientRequest(
            "/api/quotes/create-quote",
            "POST",
            {
                quoteId: quoteId,
                data: {
                    draftOrderId: draftOrderId
                }
            }
        )
        return mongoRes
    }

export const deleteQuoteFromMongo =
    async (quoteId) => {
        const mongoRes = await ClientRequest(
            "/api/quotes/delete-quote",
            "POST",
            {
                quoteId: quoteId
            }
        )
        return mongoRes
    }

export const getCompanies = async (page, rowsPerPage) => {
    const comapanyRes = await ClientRequest(
        "/api/company/get-companies",
        "POST",
        {
            page: page,
            postPerPage: rowsPerPage
        }
    )

    return comapanyRes
}

export const addCompanyToMongo =
    async (companyData) => {
        const mongoRes = await ClientRequest(
            "/api/company/add-company",
            "POST",
            {
                name: companyData.companyName,
                location: {
                    address: "",
                    city: "",
                    state: "",
                    zip: "",
                },
                avatar: companyData.companyPhoto,
                contact: [
                    {
                        email: companyData.contactEmail,
                        name: companyData.contactFirstName + " " + companyData.contactLastName
                    },
                ],
                shipTo: [
                    {
                        locationName: companyData.companyShippingLocation,
                        location: {
                            attention: companyData.attentionLocation,
                            address: companyData.addressLocation,
                            city: companyData.cityLocation,
                            state: companyData.stateName.name,
                            zip: companyData.postalLocation,
                        },
                        default: true
                    },
                ]
            }
        )
        return mongoRes
    }

export const checkComapanyName =
    async (companyData) => {
        const mongoRes = await ClientRequest(
            "/api/company/get-companies",
            "POST",
            {
                type: "check",
                query: {
                    companyName: companyData
                }
            }
        )
        return mongoRes
    }

export const checkUserEmail =
    async (email) => {
        const mongoRes = await ClientRequest(
            "/api/auth/check-user",
            "POST",
            {
                email: email
            }
        )
        return mongoRes
    }

export const registerUser =
    async (userData, companyId) => {
        const mongoRes = await ClientRequest(
            "/api/auth/register-user",
            "POST",
            {
                name: userData.contactFirstName + " " + userData.contactLastName,
                email: userData.contactEmail,
                phone: "",
                password: "",
                company: {
                    companyId: companyId,
                    companyName: userData.companyName
                },
                status: "invite"
            }
        )
        return mongoRes
    }