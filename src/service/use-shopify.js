import { useDataService, useSwrData, useSWRInfiniteData } from "src/lib/fetchData";

export const SyncQuoteToShopify = async (
  quoteId,
  quotesList,
  companyBill,
  discount,
  payment,
  draftOrderId
) => {
  const lineItems = quotesList.map((list) => {
    return `{
              variantId: "${list.variant.id}",
              quantity: ${list.qty}
            }`;
  });

  const resSendToShopify = await useDataService("/api/shopify/draft-order", "POST", {
    lineItems,
    poNumber: quoteId,
    companyBill,
    discount,
    payment,
    draftOrderId,
  });

  if (draftOrderId) {
    return {
      operation: "update",
      response: resSendToShopify,
    };
  }

  return {
    operation: "create",
    response: resSendToShopify,
  };
};

export const SendInvoiceByShopify = async (id) => {
  const sendToShopify = await useDataService("/api/shopify/send-invoice", "POST", { id: id });
  return sendToShopify;
};

const generateParams = (props) => {
  const {
    selectedFilter = {
      productName: "",
      collection: "",
      productType: "",
      productVendor: "",
      tag: "",
    },
    selectedVariantFilter = [],
    smartSearch,
    productPerPage,
    catalogId = [],
    catalogCompany = [],
    cursor
  } = props;

  let company = []
  if(catalogCompany.length > 0) {
    company = catalogCompany.map((item) => item?.id)
  }
  const { productName, productType, tag, productVendor, collection } = selectedFilter;
  let paramQuery;
  let url;
  
  const cursorId = (cursor) => {
    if(cursor) {
      if(cursor.firstCursor) {
        return `&firstCursor=${cursor.firstCursor}`
      } else {
        return `&lastCursor=${cursor.lastCursor}`
      }
    }
    return ""
  }

  if (collection) {
    const params = {
      productName,
      productType,
      tag,
      productVendor,
      collection,
      productPerPage,
      firstCursor:cursor?.firstCursor,
      lastCursor:cursor?.lastCursor
    };
    paramQuery = new URLSearchParams(params).toString();
    url = "/api/shopify/get-products";
  } else {
    if (smartSearch) {
      paramQuery = `selectedFilter=${smartSearch}&productPerPage=${productPerPage}${cursorId(cursor)}`;
      url = "/api/shopify/smart-search";
    } else {
      if (!selectedFilter.collection) {
        const paramNoTitle = selectedVariantFilter.filter((item) => !item["productName"]);
        if (catalogId) {
          if(Array.isArray(catalogId)) {
            catalogId.forEach((itm) => {
              paramNoTitle.push({
                productMetafield: { namespace: "b2b", key: "catalog", value: itm },
              });
            })
          } else {
            paramNoTitle.push({
              productMetafield: { namespace: "b2b", key: "catalog", value: catalogId },
            });
          }
        }
        paramQuery = `selectedFilter=${JSON.stringify(
          paramNoTitle
        )}&productPerPage=${productPerPage}&productName=${productName}&company=${JSON.stringify(company)}${cursorId(cursor)}`
        url = "/api/product/search-products";
      }
    }
  }
  return {
    paramQuery,
    url
  }
}

export const GetProductsInfinite = (props) => {
  const { runFetch } = props
  const param = generateParams(props)
  const dataRes = useSWRInfiniteData(param.url, param.paramQuery, runFetch);
  return dataRes;
};

export const GetProductsPaginate = (props) => {
  const { runFetch } = props
  const param = generateParams(props)
  const dataRes = useSwrData(param.url, param.paramQuery, runFetch);
  return dataRes;
};

export const GetProductsShopify = async (selectedFilter, productPerPage, lastCursor, pageIndex) => {
  const { productName, productType, tag, productVendor, collection } = selectedFilter;
  const newParam = { ...selectedFilter };
  Object.keys(newParam).forEach((key) => {
    if (!newParam[key]) delete newParam[key];
    if (newParam[key] === "*") delete newParam[key];
  });

  const queryParam = new URLSearchParams(newParam).toString();
  const productNameForCollection = productName.replace("*", "");
  const sendToShopify = await useDataService("/api/shopify/get-products", "POST", {
    queryParam,
    productName: productNameForCollection,
    productType,
    tag,
    productVendor,
    collection,
    productPerPage,
    lastCursor,
    pageIndex,
  });
  return sendToShopify;
};

export const GetProductsMeta = async (inputValue) => {
  let url;
  switch (inputValue) {
    case "collections":
      url = `/api/shopify/get-collections`;
      break;
    case "prodType":
      url = `/api/shopify/get-product-type`;
      break;
    case "prodVendor":
      url = `/api/shopify/get-product-vendor`;
      break;
    case "prodTag":
      url = `/api/shopify/get-product-tag`;
      break;
    case "Catalog":
      url = `/api/catalog/get-shopify-catalogs`;
      break;
    default:
      url = `/api/shopify/error`;
  }
  const sendToShopify = useDataService(url, "GET");
  return sendToShopify;
};

export const GetOrdersDataSwr = (page, session) => {
  const queryPath =
    "page=" +
    page.direction +
    "&startCursor=" +
    page.startCursor +
    "&endCursor=" +
    page.endCursor +
    "&session=" +
    session.session +
    "&sessionId=" +
    session.id;
  const quotesRes = useSwrData("/api/shopify/get-orders", queryPath);

  return quotesRes;
};

export const GetProductByhandleSwr = (handle) => {
  const queryPath = "productHandle=" + handle;
  const productRes = useSwrData("/api/shopify/get-product-byhandle", queryPath);
  return productRes;
};

export const GetSingleOrderSwr = (id) => {
  const queryPath = "id=" + id;
  const productRes = useSwrData("/api/shopify/get-single-order", queryPath);
  return productRes;
};
export const GetInventorySwr = (page) => {
  const queryPath =
    "page=" + page.direction + "&startCursor=" + page.startCursor + "&endCursor=" + page.endCursor;
  const dataRes = useSwrData("/api/shopify/inventory", queryPath);
  return dataRes;
};

export const SyncUserShopify = async (userData) => {
  const shopifyRes = await useDataService("/api/auth/sync-customer", "POST", {
    firstName: userData.contactFirstName,
    lastName: userData.contactLastName,
    email: userData.contactEmail,
  });
  return shopifyRes;
};

export const CreateCompanyShopify = async (userData) => { 
  const shopifyRes = await useDataService("/api/company/create-shopify-company", "POST", userData);
  return shopifyRes;
};

export const GetCompanyLocation = async (companyID) => {
  const shopifyRes = await useDataService(`/api/auth/get-customer?companyID=${companyID}`, "GET");
  return shopifyRes;
};

export const GetUserShopify = async (email) => {
  const shopifyRes = await useDataService(`/api/auth/get-customer?email=${email}`, "GET");
  return shopifyRes;
};

export const UpdateProductMetafield = async (props) => {
  const shopifyRes = await useDataService(`/api/product/update-product-metafield`, "POST", props);
  return shopifyRes;
};

export const GetCatalogProducts = async (props) => {
  const shopifyRes = useSwrData(`/api/catalog/get-catalog-products`);
  return shopifyRes;
};

export const GetShopifyCatalogs = (props) => {
  const shopifyRes = useSwrData(`/api/catalog/get-shopify-catalogs`);
  return shopifyRes;
};

export const GetShopifyCatalog = (catalogId) => {
  const queryPath = `catalogID=${catalogId}`
  const shopifyRes = useSwrData(`/api/catalog/get-shopify-catalog`, queryPath);
  return shopifyRes;
};

export const GetSyncCatalogProducts = async (catalogID) => {
  const shopifyRes = useDataService(`/api/catalog/get-catalog-products-sync?catalogID=${catalogID}`, "GET");
  return shopifyRes;
};

export const GetPricelistPrices = async (products, shopifyCatalog) => {
  const productsList = products.newData.edges.map(item => {return ({ id: item.node.id.replace("gid://shopify/Product/", "") })})
  const shopifyRes = useDataService(`/api/catalog/get-shopify-pricelist-prices`, "POST", {
    productsList,
    priceListID: shopifyCatalog.newData.data.catalog.priceList.id
  });
  return shopifyRes;
};
