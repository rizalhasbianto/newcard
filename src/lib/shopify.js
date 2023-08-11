const domain = process.env.SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.SHOPIFY_STORE_FRONT_ACCESS_TOKEN;

export async function callShopify(query) {
    const fetchUrl = `https://${domain}/api/2022-01/graphql.json`;
  
    const fetchOptions = {
      endpoint: fetchUrl,
      method: "POST",
      headers: {
        "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query })
    };
  
    try {
      const data = await fetch(fetchUrl, fetchOptions).then((response) => response.json());
      return data;
    } catch (error) {
      try {
        const data = await fetch(fetchUrl, fetchOptions).then((response) => response.json());
        return data;
      } catch (error) {
        throw new Error("Could not fetch products!");
      }
    }
  }