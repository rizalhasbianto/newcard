import { callShopify } from "src/lib/shopify";

export default async function syncOptions(req, res) {
  const query = (cursor) => {
    return `
            products(first: 50 ${cursor}) {
              pageInfo {
                hasNextPage
                endCursor
              }
              edges {
                node {
                  id
                  options {
                    name
                    values
                  }
                }
              }
            }`;
  };
  let hasNextPage = true;
  let cursor = "";
  let prodData = [];
  let options = []

  while (hasNextPage) {
    const queryWithoutCollection = `{
        ${query(cursor)}
      }`;
    const resGetData = await callShopify(queryWithoutCollection);
    const resData = resGetData.data.products;
    resData.edges.map((prod) => prodData.push(prod));
    cursor = `, after: "${resData.pageInfo.endCursor}"`;
    hasNextPage = resData.pageInfo.hasNextPage;
  }
  if(prodData.length > 0) {
    prodData.map((prod) => {
        prod.node.options.map((opt,i) => {
            const isHaveSameOpt = options.findIndex((optI) => optI.name === opt.name)
                if(isHaveSameOpt < 0 ) {
                    options.push(opt)
                } else {
                    opt.values.map((val) => {
                        const isHaveSameVal = options[isHaveSameOpt].values.findIndex((optVal) => optVal === val)
                        if(isHaveSameVal < 0) {
                            options[isHaveSameOpt].values.push(val)
                        }
                    })
                }
            
        })
    })
  }
  res.json({ status: 200, data: options });
}
