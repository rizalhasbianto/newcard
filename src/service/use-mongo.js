import { usePostData } from 'src/lib/fetchData'

export const GetQuotesData =
    async (page, rowsPerPage, query, sort, type) => {
        const quotesRes = await usePostData(
            "/api/quotes/get-quotes",
            "POST",
            {
                page: page,
                postPerPage: rowsPerPage,
                query: query,
                sort: sort,
                type: type ? type : "any"
            }
        )

        return quotesRes
    }
export const SaveQuoteToMongoDb =
    async (
        companyName,
        shipTo,
        quotesList,
        discount,
        status,
        quoteId
    ) => {
        const countSubtotal = quotesList.reduce((n, { total }) => n + total, 0)
        const tax = (countSubtotal * 0.1).toFixed(2)
        const total = Number(countSubtotal) + Number(tax)
        const today = new Date()
        const mongoRes = await usePostData(
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
                    updatedAt: today,
                    discount: discount
                }
            }
        )
        return mongoRes
    }

export const AddNewQuoteToMongoDb =
    async () => {
        const today = new Date()
        const mongoRes = await usePostData(
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
                draftOrderId: "",
                draftOrderNumber: "",
                discount: {
                    type: "",
                    amount: ""
                }
            }
        )
        return mongoRes
    }

export const UpdateOrderIdQuoteToMongoDb =
    async (quoteId, draftOrderId) => {
        const mongoRes = await usePostData(
            "/api/quotes/update-quote",
            "POST",
            {
                quoteId: quoteId,
                data: {
                    draftOrderId: draftOrderId.id,
                    draftOrderNumber: draftOrderId.name
                }
            }
        )
        return mongoRes
    }

export const DeleteQuoteFromMongo =
    async (quoteId) => {
        const mongoRes = await usePostData(
            "/api/quotes/delete-quote",
            "POST",
            {
                quoteId: quoteId
            }
        )
        return mongoRes
    }

export const GetCompanies = async (page, rowsPerPage) => {
    const comapanyRes = await usePostData(
        "/api/company/get-companies",
        "POST",
        {
            page: page,
            postPerPage: rowsPerPage
        }
    )

    return comapanyRes
}

export const AddCompanyToMongo =
    async (companyData) => {
        const mongoRes = await usePostData(
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

export const CheckCompanyName =
    async (companyData) => {
        const mongoRes = await usePostData(
            "/api/company/get-companies",
            "POST",
            {
                type: "check",
                query: {
                    name: companyData
                }
            }
        )
        return mongoRes
    }

export const CheckUserEmail =
    async (email) => {
        const mongoRes = await usePostData(
            "/api/auth/check-user",
            "POST",
            {
                query: { email: email },
                type: "email"
            }
        )
        return mongoRes
    }
export const FindUserById =
    async (userId) => {
        const mongoRes = await usePostData(
            "/api/auth/check-user",
            "POST",
            {
                query: { id: userId },
                type: "id"
            }
        )
        return mongoRes
    }

export const RegisterUser =
    async (userData, companyId) => {
        const mongoRes = await usePostData(
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
                status: "invite",
                role: "customer"
            }
        )
        return mongoRes
    }

export const InviteUser =
    async (userData, userId) => {
        const mongoRes = await usePostData(
            "/api/email/invite",
            "POST",
            {
                name: userData.contactFirstName + " " + userData.contactLastName,
                email: userData.contactEmail,
                userId: userId
            }
        )
        return mongoRes
    }

export const UpdatePassword =
    async (newPassword, userId) => {
        const mongoRes = await usePostData(
            "/api/auth/update-password",
            "POST",
            {
                newPassword: newPassword,
                userId: userId
            }
        )
        return mongoRes
    }