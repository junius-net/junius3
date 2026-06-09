import { shopifyFetch } from "@/lib/shopify";
import { getProductQuery } from "@/lib/shopify/queries";
import Image from "next/image";
import ProductForm from "@/components/product/ProductForm";

export default async function ProductPage({ params }) {
  const { handle } = await params;

  const { body } = await shopifyFetch({
    query: getProductQuery,
    variables: { handle }
  });

  const product = body.data?.product;

  if (!product) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <h1>Product not found</h1>
      </div>
    );
  }

  return (
    <main style={{ padding: "8rem 2rem 4rem", display: "flex", flexWrap: "wrap", gap: "4rem", maxWidth: "1400px", margin: "0 auto" }}>
      <div style={{ flex: "1 1 500px", display: "flex", flexDirection: "column", gap: "1rem" }}>
        {product.images.edges.map(({ node }, index) => (
          <div key={index} style={{ position: "relative", aspectRatio: "3/4", width: "100%", backgroundColor: "rgba(150,150,150,0.1)" }}>
            <Image
              src={node.url}
              alt={node.altText || product.title}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        ))}
      </div>

      <div style={{ flex: "1 1 400px", position: "sticky", top: "8rem", height: "fit-content" }}>
        <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>{product.title}</h1>
        <p style={{ fontSize: "1.2rem", fontFamily: "var(--font-inter)", marginBottom: "2rem", opacity: 0.9 }}>
          {product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}
        </p>

        <ProductForm product={product} />

        <div 
          style={{ marginTop: "3rem", fontFamily: "var(--font-inter)", opacity: 0.8, lineHeight: 1.6, fontSize: "0.9rem" }}
          dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} 
        />
      </div>
    </main>
  );
}
