import { shopifyFetch } from "@/lib/shopify";
import { getProductsQuery } from "@/lib/shopify/queries";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const rawQuery = searchParams.get("query") || "";
  const queryText = rawQuery.trim();

  if (!queryText) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const formattedQuery = `title:*${queryText}*`;

  try {
    const { body } = await shopifyFetch({
      query: getProductsQuery,
      variables: { query: formattedQuery },
      cache: "no-store",
    });

    const products = body?.data?.products?.edges?.map(({ node }) => ({
      title: node.title,
      handle: node.handle,
      image: node.images?.edges?.[0]?.node?.url || null,
      price: node.priceRange?.minVariantPrice
        ? `${node.priceRange.minVariantPrice.amount} ${node.priceRange.minVariantPrice.currencyCode}`
        : "",
    })) || [];

    const normalizedQuery = queryText.toLowerCase();
    const filtered = products.filter((product) =>
      product.title.toLowerCase().includes(normalizedQuery)
    );

    return new Response(JSON.stringify(filtered), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Search API error:", error);
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}
