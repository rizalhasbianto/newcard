import { useDataService, useSwrData } from "src/lib/fetchData";
import { utcToZonedTime } from "date-fns-tz";

const today = utcToZonedTime(new Date(), "America/Los_Angeles");

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

export const GetCompanies = async (props) => {
  const { page = 0, postPerPage = 100, query, withQuote=false } = props;
  const queryData = JSON.stringify(query);
  const queryPath =
    "withQuote=" + withQuote +
    "&page=" + page +
    "&postPerPage=" + postPerPage +
    "&query=" + queryData +
    "&avatar=false";
  const fetchPath = "/api/company/get-companies?" + queryPath;
  const comapanyRes = await useDataService(fetchPath, "GET");
  return comapanyRes;
};

export const GetCompaniesSwr = (props) => {
  const { page, postPerPage, query, withQuote=true } = props;
  const queryString = query ? JSON.stringify(query) : "";
  const queryPath =
    "withQuote==" + withQuote + 
    "&page=" +page +
    "&postPerPage=" + postPerPage +
    "&query=" + queryString +
    "&avatar=true";
  const comapanyRes = useSwrData("/api/company/get-companies", queryPath);

  return comapanyRes;
};

export const GetCompanyCatalog = (props) => {
  const { id, query } = props;
  const queryPath = "?id=" + id + "&query=" + JSON.stringify(query)
  const comapanyRes = useDataService("/api/company/get-company-catalog" + queryPath , "GET");
  return comapanyRes;
};

export const GetSingleCompaniesSwr = (props) => {
  const { id, page, postPerPage } = props
  const queryPath =
    "withQuote=true&quotePage=" +
    page +
    "&quotePostPerPage=" +
    postPerPage +
    "&avatar=true&id=" +
    id;
  const comapanyRes = useSwrData("/api/company/get-company", queryPath);

  return comapanyRes;
};

export const AddCompanyToMongo = async (
  companyData,
  shopifyCompanyId,
  shopifyCompanyLocationId
) => {
  const mongoRes = await useDataService("/api/company/create-company", "POST", {
    name: companyData.companyName,
    about: companyData.companyAbout,
    catalogIDs: [],
    shopifyCompanyId: shopifyCompanyId,
    shopifyCompanyLocationId: shopifyCompanyLocationId,
    sales: {
      id: companyData.sales._id,
      name: companyData.sales.name,
    },
    marked: companyData.marked ? true : false,
    defaultpaymentTypeChange: "No",
    location: {
      address: companyData.addressLocation,
      city: companyData.cityLocation,
      state: companyData.stateNameLocation.name,
      zip: companyData.postalLocation,
    },
    avatar: companyData.companyPhoto,
    contact: [],
    shipTo: [
      {
        locationName: companyData.useAsShipping
          ? "Company Location"
          : companyData.companyShippingName,
        location: {
          address: companyData.useAsShipping
            ? companyData.addressLocation
            : companyData.addressShipping,
          city: companyData.useAsShipping ? companyData.cityLocation : companyData.cityShipping,
          state: companyData.useAsShipping
            ? companyData.stateNameLocation.name
            : companyData.stateNameShipping.name,
          zip: companyData.useAsShipping ? companyData.postalLocation : companyData.postalShipping,
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

export const UpdateCompanyCatalog = async (props) => {
  const { mongoCompanyID, catalogID, catalogList, companyLocationID, selected } = props;
  const companyLocationIds = (catalogList, companyLocationID, selected) => {
    if(selected) {
      const catalogData = catalogList.map((item) => item.node.id)
      return [...catalogData, `gid://shopify/CompanyLocation/${companyLocationID}`]
    } else {
      const findCatalog = catalogList.findIndex((item) => item.node.id.replace("gid://shopify/CompanyLocation/", "") === companyLocationID)
      catalogList.splice(findCatalog, "1")
      const catalogData = catalogList.map((item) => item.node.id)
      return [...catalogData]
    }
  }
  const mongoRes = await useDataService("/api/catalog/assign-company-catalog", "POST", { 
    catalogID,
    updateData: {
      companyLocationIds: companyLocationIds(catalogList, companyLocationID, selected),
      mongoCompanyID: mongoCompanyID,
      selected
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

export const CheckCompanyName = async (companyName) => {
  const query = JSON.stringify({ name: companyName });
  const mongoRes = await useDataService("/api/company/get-companies?query=" + query, "GET");
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
    phone: userData.contactPhone,
    password: userData.password,
    company: {
      companyId:companyId,
      companyName:userData.companyName
    },
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

export const CreateCatalog = async (props) => {
  const { shopifyCatalog, session, catalogId } = props;
  const createData = {
    shopifyCatalogID: catalogId,
    productsCount: shopifyCatalog.totalProducts,
    createdAt: today,
    createdBy: {
      name: session.user.detail.name,
      role: session.user.detail.role,
    },
    lastUpdateAt:"",
  };
  const mongoRes = await useDataService("/api/catalog/create-catalog", "POST", createData);
  return mongoRes;
};

export const UpdateCatalog = async (props) => {
  const { shopifyCatalog, monoCatalogId } = props;
  const mongoRes = await useDataService("/api/catalog/update-catalog", "POST", {
    id: monoCatalogId,
    updateData: {
      lastUpdateAt: today,
      productsCount: shopifyCatalog.totalProducts,
    },
  });
  return mongoRes;
};

export const GetCatalogSwr = (props) => {
  const { page, postPerPage, query } = props;
  const queryString = query ? JSON.stringify(query) : "";
  const queryPath = "&page=" + page + "&postPerPage=" + postPerPage + "&query=" + queryString;
  const mongoRes = useSwrData("/api/catalog/get-catalog", queryPath);
  return mongoRes;
};
