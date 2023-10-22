import { useDataService } from "src/lib/fetchData";

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

export const GetProductsShopify = async (query, productPerPage, lastCursor, lodMoreCount) => {
  const {prodName, prodType, prodTag, prodVendor, collection} = query
  const sendToShopify = await useDataService("/api/shopify/get-products", "POST", {
    prodName,
    prodType,
    prodTag,
    prodVendor,
    collection,
    productPerPage,
    lastCursor,
    lodMoreCount
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
    default:
      url = `/api/shopify/error`;
  }
  const sendToShopify = useDataService(url, "GET");
  return sendToShopify;
};
