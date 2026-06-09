const domain = process.env.SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

export async function shopifyFetch({ cache = 'force-cache', headers, query, tags, variables }) {
  try {
    if (!domain) {
      throw new Error('Missing SHOPIFY_STORE_DOMAIN environment variable');
    }
    if (!storefrontAccessToken) {
      console.warn('Warning: Missing SHOPIFY_STOREFRONT_ACCESS_TOKEN environment variable');
    }
    const result = await fetch(domain, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
        ...headers
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables })
      }),
      cache,
      ...(tags && { next: { tags } })
    });

    const body = await result.json().catch(() => null);

    if (!body) {
      const text = await result.text().catch(() => null);
      throw new Error(`Invalid JSON response from Shopify (${result.status}): ${text}`);
    }

    if (body.errors) {
      throw {
        type: 'graphql',
        message: 'Shopify GraphQL error',
        errors: body.errors,
        body,
      };
    }

    return {
      status: result.status,
      body
    };
  } catch (error) {
    console.error('Error in shopifyFetch:', error, { query, variables, domain, status: error?.status });
    throw {
      error: error.message ? error.message : error,
      query,
      variables
    };
  }
}
