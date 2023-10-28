import { useDataService, useSwrData, useSWRInfiniteData } from "src/lib/fetchData";

export const SyncQuoteToShopify = async (
  quoteId,
  quotesList,
  customerEmail,
  discount,
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
    customerEmail,
    discount,
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
  const newParam = {...selectedFilter}
  Object.keys(newParam).forEach(key => {
    if(!newParam[key])
    delete newParam[key]
 });
  const queryParam = new URLSearchParams(newParam).toString();
  const sendToShopify = await useDataService("/api/shopify/get-products", "POST", {
    queryParam,
    productName,
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
    productPerPage
  }
  const queryParam = new URLSearchParams(params).toString();
  const quotesRes = useSWRInfiniteData("/api/shopify/get-products-swr", queryParam);

  return quotesRes;
};

export const SearchProducts = (selectedFilter, selectedVariantFilter, productPerPage) => { 
  const { prodName, prodType, prodTag, prodVendor, collection } = selectedFilter;  
  let queryParam
  let url
  if(collection) {
    const params = {
      prodName,
      prodType, 
      prodTag,
      prodVendor,
      collection,
      productPerPage
    }
    queryParam = new URLSearchParams(params).toString();
    url = "/api/shopify/get-products-swr"
  } else {
    queryParam = selectedVariantFilter.length > 0 ?`selectedFilter=${JSON.stringify(selectedVariantFilter)}` : ""
    url = "/api/shopify/search-products"
  }           
console.log("url", url)
console.log("queryParam", queryParam)
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

export const GetOrdersDataSwr = (page) => {
  const queryPath =
    "page=" +
    page.direction +
    "&startCursor=" +
    page.startCursor +
    "&endCursor=" +
    page.endCursor;
  const quotesRes = useSwrData("/api/shopify/get-orders", queryPath);

  return quotesRes;
};
