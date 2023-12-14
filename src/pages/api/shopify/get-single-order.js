import { adminAPi } from "src/lib/shopify";

export default async function getSingleOrder(req, res) {
  const query = `{
    order(id: "gid://shopify/Order/${req.query.id}") {
      id
      name
      poNumber
      paymentTerms {
        paymentTermsName
        paymentTermsType
        overdue
      }
      paymentGatewayNames
      processedAt
      customer{
        displayName
      }
      shippingAddress {
        name
        phone
        address1
        city
        company
        country
        province
      }
      currentTotalPriceSet {
        shopMoney {
            amount
        }
      }
      taxLines {
        title
        priceSet {
          shopMoney {
            amount
          }
        }
      }
      totalDiscountsSet {
        shopMoney {
          amount
        }
      }
      currentSubtotalLineItemsQuantity
      displayFinancialStatus
      displayFulfillmentStatus
      createdAt
      lineItems(first: 100) {
        edges {
          node {
            title
            variantTitle
            sku
            quantity
            image {
              url: url(transform: { maxWidth: 270, preferredContentType:WEBP})
            }
            originalTotalSet {
              shopMoney {
                amount
              }
            }
            originalUnitPriceSet {
              shopMoney {
                amount
              }
            }
          }
        }
      }
    }
  }`;

  const resGetOrders = await adminAPi(query);
  res.status(200).json({ newData: resGetOrders });
}
