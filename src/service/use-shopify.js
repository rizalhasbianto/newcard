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

const GetProductsShopifySwr = (selectedFilter, productPerPage) => {
  const { prodName, prodType, prodTag, prodVendor, collection } = selectedFilter;
  const params = {
    prodName,
    prodType,
    prodTag,
    prodVendor,
    collection,
    productPerPage,
  };
  const queryParam = new URLSearchParams(params).toString();
  const quotesRes = useSWRInfiniteData("/api/shopify/get-products-swr", queryParam);

  return quotesRes;
};

export const SearchProducts = (
  selectedFilter,
  selectedVariantFilter,
  smartSearch,
  productPerPage
) => {
  const { productName, productType, tag, productVendor, collection } = selectedFilter;
  let queryParam;
  let url;

  if (collection) {
    const params = {
      productName,
      productType,
      tag,
      productVendor,
      collection,
      productPerPage,
    };
    queryParam = new URLSearchParams(params).toString();
    url = "/api/shopify/get-products-swr";
  } else {
    if (smartSearch) {
      queryParam = `selectedFilter=${smartSearch}&productPerPage=${productPerPage}`;
      url = "/api/shopify/smart-search";
    } else {
      if (!selectedFilter.collection) {
        const paramNoTitle = selectedVariantFilter.filter((item) => !item["productName"]);
        queryParam =
          selectedVariantFilter.length > 0
            ? `selectedFilter=${JSON.stringify(
                paramNoTitle
              )}&productPerPage=${productPerPage}&productName=${productName}`
            : "";
        url = "/api/shopify/search-products";
      }
    }
  }
  const dataRes = useSWRInfiniteData(url, queryParam);
  return dataRes;
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
  const shopifyRes = await useDataService("/api/shopify/sync-customer", "POST", {
    firstName: userData.contactFirstName,
    lastName: userData.contactLastName,
    email: userData.contactEmail,
  });
  return shopifyRes;
};

export const GetUserShopify = async (email) => {
  const shopifyRes = await useDataService(`/api/shopify/get-customer?email=${email}`, "GET");
  return shopifyRes;
};
