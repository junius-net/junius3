import { shopifyFetch } from "@/lib/shopify";
import { getProductsQuery } from "@/lib/shopify/queries";
import Link from "next/link";
import Image from "next/image";
import SearchTitleClient from "@/components/search/SearchTitleClient";

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }) {
  const query = searchParams?.query?.toString()?.trim() || "";
  const searchTitle = query ? `SEARCH: ${query}` : "SEARCH";
  let products = [];

  if (query) {
    try {
      const { body } = await shopifyFetch({
        query: getProductsQuery,
        variables: { query: `title:*${query}*` },
        cache: "no-store",
      });

      products = (body?.data?.products?.edges || [])
        .map(({ node }) => ({
          ...node,
          image: node.images?.edges?.[0]?.node?.url || null,
          price: node.priceRange?.minVariantPrice
            ? `${node.priceRange.minVariantPrice.amount} ${node.priceRange.minVariantPrice.currencyCode}`
            : "",
        }))
        .filter((product) => product.title.toLowerCase().includes(query.toLowerCase()));
    } catch (error) {
      console.error("Search page fetch failed:", error);
      products = [];
    }
  }

  return (
    <main style={{ padding: "10rem 2rem 4rem" }}>
      <SearchTitleClient query={query} />
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "2.8rem", marginBottom: "1rem" }}>{searchTitle}</h1>
        {query ? (
          <p style={{ marginBottom: "2rem", opacity: 0.8 }}>
            {products.length === 0
              ? `No results found for "${query}".`
              : `${products.length} product${products.length === 1 ? "" : "s"} found.`}
          </p>
        ) : (
          <p style={{ marginBottom: "2rem", opacity: 0.8 }}>
            We're sorry, we couldn't find any results.
          </p>
        )}

        {query && products.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "2rem" }}>
            {products.map((product) => (
              <Link key={product.handle} href={`/products/${product.handle}`} style={{ display: "block", color: "inherit", textDecoration: "none" }}>
                <div style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden", marginBottom: "1rem", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "24px" }}>
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : null}
                </div>
                <h2 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>{product.title}</h2>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9rem", opacity: 0.75 }}>{product.price}</p>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </main>
  );
}
