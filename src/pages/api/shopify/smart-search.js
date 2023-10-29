import { callShopify } from "src/lib/shopify";

export default async function getProducts(req, res) {
  const gQl = `
    { predictiveSearch(
        limit:10,
        limitScope:EACH,
        searchableFields:[AUTHOR,BODY,PRODUCT_TYPE,TAG,TITLE,VARIANTS_BARCODE,VARIANTS_SKU, VARIANTS_TITLE,VENDOR], 
        types:[QUERY, PRODUCT],
        query:"${req.query?.selectedFilter}"
        )   {
                queries{
                    styledText
                    text
                }
                products {
                    id
                    title
                    productType
                    handle
                    tags
                    vendor
                    options {
                      name
                      values
                    }
                    variants(first: 100) {
                        edges {
                        node {
                            id
                            title
                            sku
                            currentlyNotInStock
                            price {
                                amount
                            }
                            selectedOptions {
                                name
                                value
                            }
                            image{
                                url: url(transform: { maxWidth: 270})
                            }
                            product {
                                id
                            }
                        }
                    }
                }
            }
    }
}`;

  const resGetData = await callShopify(gQl);
  const formatData = {
    edges: resGetData.data.predictiveSearch.products.map((item) => ({node:item})),
    predictiveSearch: resGetData.data.predictiveSearch.queries
  }
  res.status(200).json({ newData: formatData });
}
