const domain = process.env.SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.SHOPIFY_STORE_FRONT_ACCESS_TOKEN;
const apiPassword = process.env.SHOPIFY_ADMIN_PASSWORD;

export async function callShopify(query) {
    const fetchUrl = `https://${domain}/api/2024-01/graphql.json`;
  
    const fetchOptions = {
      endpoint: fetchUrl,
      method: "POST",
      headers: {
        "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query })
    };
  
    try {
      const data = await fetch(fetchUrl, fetchOptions).then((response) => response.json());
      return data;
    } catch (error) {
        throw new Error("Could not fetch products!");
    }
  }

export async function adminAPi(query) {
    const fetchUrl = `https://${domain}/admin/api/2024-01/graphql.json`;
  
    const fetchOptions = {
      endpoint: fetchUrl,
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": apiPassword,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query })
    };
  
    try {
      const data = await fetch(fetchUrl, fetchOptions).then((response) => response.json());
      return data;
    } catch (error) {
      throw new Error("error!");
    }
  }