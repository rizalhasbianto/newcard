import { useDataService, useSwrData } from "src/lib/fetchData";
import { utcToZonedTime } from "date-fns-tz";

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
  companySales,
  shipTo,
  quotesList,
  discount,
  status,
  quoteId,
  payment
) => {
  const countSubtotal = quotesList.reduce((n, { total }) => n + Number(total), 0).toFixed(2);
  const tax = (Number(countSubtotal) * 0.1).toFixed(2);
  const total = (Number(countSubtotal) + Number(tax)).toFixed(2);

  const today = utcToZonedTime(new Date(), "America/Los_Angeles");
  const mongoRes = await useDataService("/api/quotes/update-quote", "POST", {
    quoteId: quoteId,
    data: {
      company: {
        name: companyName,
        shipTo: shipTo,
        sales: companySales,
      },
      quotesList: quotesList || [],
      quoteInfo: {
        total: total,
        item: quotesList.length,
      },
      status: status,
      updatedAt: today,
      discount: discount,
      payment: payment,
    },
  });
  return mongoRes;
};

export const AddNewQuoteToMongoDb = async (props) => {
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
    createdBy: props.createdBy,
    createdAt: props.createdAt,
    updatedAt: "",
    draftOrderId: "",
    draftOrderNumber: "",
    discount: {
      type: "",
      amount: "",
    },
    payment: {
      id: "",
      date: "",
      description: "",
      viewDate: "",
    },
    checkoutUrl: "",
  });
  return mongoRes;
};

export const UpdateOrderIdQuoteToMongoDb = async (quoteId, draftOrderId, checkoutUrl) => {
  const mongoRes = await useDataService("/api/quotes/update-quote", "POST", {
    quoteId: quoteId,
    data: {
      draftOrderId: draftOrderId.id,
      draftOrderNumber: draftOrderId.name,
      checkoutUrl: checkoutUrl.url,
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
    type: "item",
  });
  return mongoRes;
};

export const DeleteQuoteFromMongo = async (quoteId) => {
  const mongoRes = await useDataService("/api/quotes/delete-quote", "POST", {
    quoteId: quoteId,
  });
  return mongoRes;
};

export const SendInvoice = async (quoteDataInvoice) => {
  const mongoRes = await useDataService("/api/email/invoice", "POST", quoteDataInvoice);
  return mongoRes;
};

export const GetCompanies = async (page, rowsPerPage, query) => {
  const comapanyRes = await useDataService("/api/company/get-companies", "POST", {
    page: page,
    postPerPage: rowsPerPage,
    query: query,
  });

  return comapanyRes;
};

export const GetCompaniesSwr = (page, postPerPage, query) => {
  const queryString = query ? JSON.stringify(query) : "";
  const queryPath =
    "withQuote=true&page=" +
    page +
    "&postPerPage=" +
    postPerPage +
    "&query=" +
    queryString +
    "&avatar=true";
  const comapanyRes = useSwrData("/api/company/get-companies", queryPath);

  return comapanyRes;
};

export const GetSingleCompaniesSwr = (id, quotePage, quotePostPerPage) => {
  const queryPath =
    "withQuote=true&quotePage=" +
    quotePage +
    "&quotePostPerPage=" +
    quotePostPerPage +
    "&avatar=true&id=" +
    id;
  const comapanyRes = useSwrData("/api/company/get-company", queryPath);

  return comapanyRes;
};

export const AddCompanyToMongo = async (companyData, shopifyCustomerId) => {
  const mongoRes = await useDataService("/api/company/add-company", "POST", {
    name: companyData.companyName,
    about: companyData.companyAbout,
    sales: {
      id: companyData.sales._id,
      name: companyData.sales.name,
    },
    marked: companyData.marked ? true : false,
    defaultpaymentTypeChange: "No",
    location: {
      address: "",
      city: "",
      state: "",
      zip: "",
    },
    avatar: companyData.companyPhoto,
    contact: [],
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
  const mongoRes = await useDataService("/api/company/update-company", "POST", {
    id: companyData.id,
    updateData: {
      name: companyData.companyName,
      about: companyData.companyAbout,
      marked: companyData.marked ? true : false,
      location: {
        address: companyData.address,
        city: companyData.city,
        state: companyData.state,
        zip: companyData.postal,
      },
      contact: companyData.contact,
      sales: companyData.newSales,
      defaultBilling: companyData.billing,
      defaultpaymentType: companyData.paymentType,
      defaultpaymentTypeChange: companyData.paymentTypeChange,
    },
  });
  return mongoRes;
};

export const AddNewUserToCompanyMongo = async (props) => {
  const { companyId, newUserData, userData = [], shopifyCustomerId } = props;

  if (newUserData.default && userData.length > 0) {
    userData.map((item) => (item.default = false));
  }

  const userDataNew = [
    ...userData,
    {
      userId: newUserData.id,
      shopifyCustomerId: shopifyCustomerId,
      default: newUserData.default ? true : false,
    },
  ];

  const mongoRes = await useDataService("/api/company/update-company", "POST", {
    id: companyId,
    updateData: {
      contact: userDataNew,
    },
  });
  return mongoRes;
};

export const UpdateCompanyContactDefault = async (props) => {
  const { companyId, defaultContact, userData } = props;
  const newContactDefault = [...userData];
  newContactDefault.map((item, i) => {
    if (item.userId === defaultContact) {
      item.default = true;
    } else {
      item.default = false;
    }
  });

  const mongoRes = await useDataService("/api/company/update-company", "POST", {
    id: companyId,
    updateData: {
      contact: newContactDefault,
    },
  });
  return mongoRes;
};

export const UpdateCompanyUserToMongo = async (id, updatedData, userData) => {
  const findUserTarget = userData.findIndex((item) => item.email === updatedData.email);
  const contactUpdate = [...userData];
  contactUpdate[findUserTarget] = {
    name: updatedData.firstName + " " + updatedData.lastName,
    email: updatedData.email,
    phone: updatedData.phone,
    default: updatedData.default,
  };
  const mongoRes = await useDataService("/api/company/update-company", "POST", {
    id: id,
    updateData: {
      contact: contactUpdate,
    },
  });
  return mongoRes;
};

export const UpdateCompanyShipToMongo = async (id, companyData, shipToData) => {
  const findShipTarget = shipToData.findIndex(
    (item) => item.locationName === companyData.companyShippingLocation
  );
  const shipToUpdate = [...shipToData];
  shipToUpdate[findShipTarget] = {
    locationName: companyData.companyShippingLocation,
    location: {
      attention: companyData.attentionLocation,
      address: companyData.addressLocation,
      city: companyData.cityLocation,
      state: companyData.stateName.name,
      zip: companyData.postalLocation,
    },
    default: companyData.default,
  };
  const mongoRes = await useDataService("/api/company/update-company", "POST", {
    id: id,
    updateData: {
      shipTo: shipToNew,
    },
  });
  return mongoRes;
};

export const UpdateCompanyShipToDefault = async (id, defaultShip, shipData) => {
  const newShippingDefault = [...shipData];
  newShippingDefault.map((item, i) => {
    if (item.locationName === defaultShip) {
      item.default = true;
    } else {
      item.default = false;
    }
  });
  const mongoRes = await useDataService("/api/company/update-company", "POST", {
    id: id,
    updateData: {
      shipTo: newShippingDefault,
    },
  });
  return mongoRes;
};

export const AddNewShipToMongo = async (id, companyData, shipToData) => {
  const shipToNew = [
    ...shipToData,
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
  ];
  const mongoRes = await useDataService("/api/company/update-company", "POST", {
    id: id,
    updateData: {
      shipTo: shipToNew,
    },
  });
  return mongoRes;
};

export const UpdateCompanyAvatarToMongo = async (id, companyPhoto) => {
  const mongoRes = await useDataService("/api/company/update-company", "POST", {
    id: id,
    updateData: {
      avatar: companyPhoto,
    },
  });
  return mongoRes;
};

export const CheckCompanyName = async (companyData) => {
  const mongoRes = await useDataService("/api/company/get-companies", "POST", {
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

export const GetUsers = (props) => {
  const { page, rowsPerPage, sessionRole, query, type } = props;
  const theType = type ? type : "any";
  const queryString = query ? JSON.stringify(query) : "";
  const querySessionRole = sessionRole ? JSON.stringify(sessionRole) : "";
  const queryPath =
    "page=" +
    page +
    "&postPerPage=" +
    rowsPerPage +
    "&sessionRole=" +
    querySessionRole +
    "&query=" +
    queryString +
    "&type=" +
    theType;
  const mongoRes = useSwrData("/api/auth/get-users", queryPath);
  return mongoRes;
};

export const RegisterUser = async (userData, companyId, shopifyCustomerId) => {
  const mongoRes = await useDataService("/api/auth/register-user", "POST", {
    name: userData.contactFirstName + " " + userData.contactLastName,
    email: userData.contactEmail,
    phone: userData.phoneLocation,
    password: userData.password,
    companyId: companyId,
    status: userData.password ? "active" : "invited",
    role: userData.role ? userData.role : "customer",
    signUpDate: userData.password ? utcToZonedTime(new Date(), "America/Los_Angeles") : "",
    shopifyCustomerId: shopifyCustomerId,
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

export const ResetPassword = async (userData) => {
  const mongoRes = await useDataService("/api/email/reset-password", "POST", {
    name: userData.name,
    email: userData.email,
    userId: userData._id,
  });
  return mongoRes;
};

export const UpdatePassword = async (newPassword, userId, type) => {
  const userData =
    type === "reset"
      ? {
          newPassword: newPassword,
          userId: userId,
        }
      : {
          newPassword: newPassword,
          userId: userId,
          status: "active",
          signUpDate: utcToZonedTime(new Date(), "America/Los_Angeles"),
        };

  const mongoRes = await useDataService("/api/auth/update-password", "POST", userData);
  return mongoRes;
};

export const SaveCollectionToMongoDb = async (collectionName, quotesList) => {
  const mongoRes = await useDataService("/api/quotes/create-quote-collection", "POST", {
    collectionName: collectionName,
    quotesList: quotesList || [],
  });
  return mongoRes;
};

export const GetQuoteCollections = (queryPath) => {
  const mongoRes = useSwrData("/api/quotes/get-quote-collections", queryPath);
  return mongoRes;
};

export const DeleteQuoteCollections = async (quoteId) => {
  const mongoRes = await useDataService("/api/quotes/delete-quote-collection", "POST", {
    quoteId: quoteId,
  });
  return mongoRes;
};

export const AddNewTicket = async (ticket) => {
  const mongoRes = await useDataService("/api/tickets/create-new-ticket", "POST", ticket);
  return mongoRes;
};

export const GetTicketsDataSwr = (page, rowsPerPage, query, sort, type) => {
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
  const quotesRes = useSwrData("/api/tickets/get-tickets", queryPath);

  return quotesRes;
};

export const UpdateTicket = async (props) => {
  const mongoRes = await useDataService("/api/tickets/update-ticket", "POST", {
    id: props.id,
    data: props.data,
  });
  return mongoRes;
};

export const CreateCatalog = async (type) => {
  const mongoRes = await useDataService("/api/catalog/create-catalog", "POST", {
    type:type
  });
  return mongoRes;
};

