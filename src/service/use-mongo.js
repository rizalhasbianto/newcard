import { useDataService, useSwrData } from "src/lib/fetchData";

export const GetQuotesData = async (page, rowsPerPage, query, sort, type) => {
  const quotesRes = await useDataService("/api/quotes/get-quotes", "POST", {
    page: page,
    postPerPage: rowsPerPage,
    query: query,
    sort: sort,
    type: type ? type : "any",
  });

  return quotesRes;
};
 
export const GetQuotesDataSwr = (page, rowsPerPage, query, sort, type) => {
  const theType = type ? type : "any";
  const queryPath =
    "page=" +
    page +
    "&postPerPage=" +
    rowsPerPage +
    "&query=" +
    JSON.stringify(query) +
    "&sort=" +
    sort +
    "&type=" +
    theType;
  const quotesRes = useSwrData("/api/quotes/get-quotes", queryPath);

  return quotesRes;
};

export const SaveQuoteToMongoDb = async (
  companyName,
  shipTo,
  quotesList,
  discount,
  status,
  quoteId
) => {
  const countSubtotal = quotesList.reduce((n, { total }) => n + Number(total), 0).toFixed(2);
  const tax = (Number(countSubtotal) * 0.1).toFixed(2);
  const total = (Number(countSubtotal) + Number(tax)).toFixed(2);

  const today = new Date();
  const mongoRes = await useDataService("/api/quotes/update-quote", "POST", {
    quoteId: quoteId,
    data: {
      company: {
        name: companyName,
        shipTo: shipTo,
      },
      quotesList: quotesList || [],
      quoteInfo: {
        total: total,
        item: quotesList.length,
      },
      status: status,
      updatedAt: today,
      discount: discount,
    },
  });
  return mongoRes;
};

export const AddNewQuoteToMongoDb = async () => {
  const today = new Date();
  const mongoRes = await useDataService("/api/quotes/create-quote", "POST", {
    company: {
      name: "",
      shipTo: "",
    },
    quotesList: [],
    quoteInfo: {
      total: "",
      item: 0,
    },
    status: "new",
    createdAt: today,
    updatedAt: "",
    draftOrderId: "",
    draftOrderNumber: "",
    discount: {
      type: "",
      amount: "",
    },
  });
  return mongoRes;
};

export const UpdateOrderIdQuoteToMongoDb = async (quoteId, draftOrderId) => {
  const mongoRes = await useDataService("/api/quotes/update-quote", "POST", {
    quoteId: quoteId,
    data: {
      draftOrderId: draftOrderId.id,
      draftOrderNumber: draftOrderId.name,
    },
  });
  return mongoRes;
};

export const UpdateQuoteItem = async (quoteId, quoteItem) => {
  const mongoRes = await useDataService("/api/quotes/update-quote", "POST", {
    quoteId: quoteId,
    data: {
      quotesList: quoteItem,
    },
    type:"item"
  });
  return mongoRes;
};

export const DeleteQuoteFromMongo = async (quoteId) => {
  const mongoRes = await useDataService("/api/quotes/delete-quote", "POST", {
    quoteId: quoteId,
  });
  return mongoRes;
};

export const GetCompanies = async (page, rowsPerPage) => {
  const comapanyRes = await useDataService("/api/company/get-companies", "POST", {
    page: page,
    postPerPage: rowsPerPage,
  });

  return comapanyRes;
};

export const GetCompaniesSwr = (page, postPerPage) => {
  const queryPath = "withQuote=true&page=" + page + "&postPerPage=" + postPerPage + "&avatar=true";
  const comapanyRes = useSwrData("/api/company/get-companies", queryPath);

  return comapanyRes;
};

export const GetSingleCompaniesSwr = (id, quotePage, quotePostPerPage) => {
  const queryPath = "withQuote=true&quotePage=" + quotePage + "&quotePostPerPage=" + quotePostPerPage + "&avatar=true&id=" + id;
  const comapanyRes = useSwrData("/api/company/get-company", queryPath);

  return comapanyRes;
};

export const AddCompanyToMongo = async (companyData) => {
  const mongoRes = await useDataService("/api/company/add-company", "POST", {
    name: companyData.companyName,
    about: companyData.companyAbout,
    marked: companyData.marked ? true : false,
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
        name: companyData.contactFirstName + " " + companyData.contactLastName,
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
        default: true,
      },
    ],
  });
  return mongoRes;
};

export const UpdateCompanyInfoToMongo = async (companyData) => {
  const mongoRes = await useDataService("/api/company/add-company", "POST", {
    name: companyData.companyName,
    about: companyData.companyAbout,
    marked: companyData.marked ? true : false,
    location: {
      address: "",
      city: "",
      state: "",
      zip: "",
    },
    contact: [
      {
        email: companyData.contactEmail,
        name: companyData.contactFirstName + " " + companyData.contactLastName,
      },
    ],
  });
  return mongoRes;
};

export const UpdateCompanyShipToMongo = async (companyData) => {
  const mongoRes = await useDataService("/api/company/add-company", "POST", {
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
        default: companyData.default ? true : false,
      },
    ],
  });
  return mongoRes;
};

export const UpdateCompanyAvatarToMongo = async (companyData) => {
  const mongoRes = await useDataService("/api/company/add-company", "POST", {
    avatar: companyData.companyPhoto,
  });
  return mongoRes;
};

export const CheckCompanyName = async (companyData) => {
  const mongoRes = await useDataService("/api/company/get-companies", "POST", {
    type: "check",
    query: {
      name: companyData,
    },
  });
  return mongoRes;
};

export const CheckUserEmail = async (email) => {
  const mongoRes = await useDataService("/api/auth/check-user", "POST", {
    query: { email: email },
    type: "email",
  });
  return mongoRes;
};
export const FindUserById = async (userId) => {
  const mongoRes = await useDataService("/api/auth/check-user", "POST", {
    query: { id: userId },
    type: "id",
  });
  return mongoRes;
};

export const RegisterUser = async (userData, companyId) => {
  const mongoRes = await useDataService("/api/auth/register-user", "POST", {
    name: userData.contactFirstName + " " + userData.contactLastName,
    email: userData.contactEmail,
    phone: "",
    password: "",
    company: {
      companyId: companyId,
      companyName: userData.companyName,
    },
    status: "invite",
    role: "customer",
  });
  return mongoRes;
};

export const InviteUser = async (userData, userId) => {
  const mongoRes = await useDataService("/api/email/invite", "POST", {
    name: userData.contactFirstName + " " + userData.contactLastName,
    email: userData.contactEmail,
    userId: userId,
  });
  return mongoRes;
};

export const UpdatePassword = async (newPassword, userId) => {
  const mongoRes = await useDataService("/api/auth/update-password", "POST", {
    newPassword: newPassword,
    userId: userId,
  });
  return mongoRes;
};
