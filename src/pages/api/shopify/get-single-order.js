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
        dueInDays
      }
      paymentGatewayNames
      processedAt
      customer{
        displayName
        email
        phone
      }
      shippingAddress {
        name
        phone
        address1
        city
        company
        country
        province
        zip
      }
      billingAddressMatchesShippingAddress
      billingAddress {
        name
        phone
        address1
        city
        company
        country
        province
        zip
      }
      shippingLine {
        title
        originalPriceSet {
          shopMoney {
            amount
          }
        }
      }
      currentTotalPriceSet {
        shopMoney {
            amount
        }
      }
      currentTotalTaxSet {
        shopMoney {
          amount
        }
      }
      totalDiscountsSet {
        shopMoney {
          amount
        }
      }
      originalTotalPriceSet {
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
  console.log("resGetOrders", resGetOrders)
  res.status(200).json({ newData: resGetOrders.data.order });
}
