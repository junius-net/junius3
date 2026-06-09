import { shopifyFetch } from "@/lib/shopify";
import { getCollectionProductsQuery } from "@/lib/shopify/queries";
import Link from "next/link";
import Image from "next/image";
import CollectionHeader from "@/components/collections/CollectionHeader";
import CollectionFilters from "@/components/collections/CollectionFilters";

const titleCase = (value) =>
  value
    ? value
        .toString()
        .replace(/-/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase())
    : "";

const slugify = (value) =>
  value
    ? value
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
    : "";

export default async function CollectionPage({ params, searchParams }) {
  const { handle } = await params;
  const { category, filter, size } = await searchParams || {};
  const pageTitle = slugify(filter || size || handle) || null;
  const selectedCategory = category ? slugify(category) : "";
  const selectedFilter = filter ? slugify(filter) : "";
  const selectedSize = size ? slugify(size) : "";
  const selectedSection = handle ? slugify(handle) : "";

  let collection = null;
  try {
    const { body } = await shopifyFetch({
      query: getCollectionProductsQuery,
      variables: { handle }
    });

    collection = body.data?.collection;
  } catch (e) {
    console.error('shopifyFetch failed on collection page:', e);
    const debug = {
      message: e?.message || e?.error || 'Shopify fetch failed',
      type: e?.type || null,
      errors: e?.errors || e?.details || null,
      query: getCollectionProductsQuery,
      variables: { handle },
    };

    return (
      <main style={{ padding: "12rem 2rem 4rem", color: "var(--dark-silver)" }}>
        <h2 style={{ marginBottom: "1rem" }}>Shopify fetch error</h2>
        <pre style={{ whiteSpace: "pre-wrap", background: "rgba(255,255,255,0.02)", padding: "1rem", borderRadius: 8 }}>{JSON.stringify(debug, null, 2)}</pre>
        <p style={{ marginTop: "1rem" }}>Revisa la consola del servidor para más detalles o confirma que las variables de entorno de Shopify están configuradas.</p>
      </main>
    );
  }

  const products = collection?.products?.edges?.map(({ node }) => ({
    ...node,
    tagList: (node.tags || []).map((tag) => slugify(tag)),
  })) || [];

  const activeTags = [selectedCategory, selectedFilter, selectedSize, selectedSection].filter(Boolean);
  const filteredProducts = activeTags.length > 0
    ? products.filter((product) => activeTags.every((tag) => product.tagList.includes(tag)))
    : products;

  const emptyContent = (
    <div
      style={{
        minHeight: "55vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "2.5rem 1.5rem",
        backgroundColor: "rgba(255,255,255,0.025)",
        borderRadius: "24px",
      }}
    >
      <p style={{ fontSize: "1rem", opacity: 0.8, maxWidth: "520px", marginBottom: "1.75rem" }}>
        More products coming soon
      </p>
      <Link
        href="/"
        style={{
          display: "inline-block",
          padding: "0.95rem 2rem",
          border: "1px solid rgba(255,255,255,0.14)",
          borderRadius: "999px",
          textDecoration: "none",
          color: "inherit",
          fontWeight: 500,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        Back to shop
      </Link>
    </div>
  );

  if (!collection || collection.products.edges.length === 0) {
    return (
      <main style={{ padding: "10rem 2rem 4rem" }}>
        <CollectionHeader
          section={handle}
          pageTitle={pageTitle}
          category={category}
          filter={filter}
          size={size}
          collectionTitle={collection?.title || handle}
          collectionDescription={null}
          isEmpty
        />

        <div
          style={{
            marginTop: "3rem",
            display: "grid",
            gridTemplateColumns: category || filter ? "280px minmax(0, 1fr)" : "1fr",
            gap: "2rem",
            alignItems: "start",
          }}
        >
          {category || filter ? <CollectionFilters /> : null}
          {emptyContent}
        </div>
      </main>
    );
  }

  return (
    <main style={{ padding: "10rem 2rem 4rem" }}>
      <CollectionHeader
        section={handle}
        pageTitle={pageTitle}
        category={category}
        filter={filter}
        size={size}
        collectionTitle={collection.title}
        collectionDescription={collection.description}
        isEmpty={false}
      />

      <div style={{ display: "grid", gridTemplateColumns: filter || category ? "280px minmax(0, 1fr)" : "1fr", gap: "2rem", alignItems: "start" }}>
        {filter || category ? (
          <CollectionFilters />
        ) : null}

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "2rem"
        }}>
          {filteredProducts.map((product) => (
            <Link key={product.id} href={`/products/${product.handle}`} style={{ display: "block" }}>
              <div style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden", marginBottom: "1rem", backgroundColor: "rgba(150,150,150,0.1)" }}>
                {product.images.edges[0] && (
                  <Image
                    src={product.images.edges[0].node.url}
                    alt={product.images.edges[0].node.altText || product.title}
                    fill
                    style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                )}
              </div>
              <h2 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>{product.title}</h2>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9rem", opacity: 0.7 }}>
                {product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
