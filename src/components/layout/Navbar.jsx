"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "../cart/CartContext";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const getPath = () => {
    if (pathname) return pathname;
    if (typeof window !== "undefined") return window.location.pathname;
    return "";
  };

  const isSoft = getPath().toLowerCase().includes("/collections/soft");
  const [scrolled, setScrolled] = useState(false);
  const [hoverCategory, setHoverCategory] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const { openCart, cart } = useCart();

  const categories = [
    {
      key: "newin",
      label: "NEW IN",
      garments: ["New arrivals", "Limited drops", "Season edits"],
      sections: ["DARK", "SOFT"],
    },
    {
      key: "tops",
      label: "TOPS",
      garments: ["Baby tees", "Blouses", "T-shirts"],
      sizes: ["XXS", "XS", "S", "M", "L", "XL", "XXL"],
      sections: ["DARK", "SOFT"],
    },
    {
      key: "bottoms",
      label: "BOTTOMS",
      garments: ["Jeans", "Skirts", "Shorts"],
      sizes: ["XXS", "XS", "S", "M", "L", "XL", "XXL"],
      sections: ["DARK", "SOFT"],
    },
    {
      key: "accessories",
      label: "ACCESSORIES",
      garments: ["Hats", "Bags", "Jewelry"],
      sections: ["DARK", "SOFT"],
    },
  ];

  const active = categories.find((category) => category.key === hoverCategory) || null;

  const slugify = (value) =>
    value
      ?.toString()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "") || "";

  const buildHref = (path, params = {}) => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.set(key, value);
    });

    const query = searchParams.toString();
    return query ? `${path}?${query}` : path;
  };

  const sectionPath = (section = "dark") => `/collections/${section.toLowerCase()}`;
  const itemHref = (item) =>
    buildHref(sectionPath(active?.sections?.[0] || "dark"), {
      filter: slugify(item),
      category: slugify(active?.label),
    });
  const sizeHref = (size) =>
    buildHref(sectionPath(active?.sections?.[0] || "dark"), {
      size: slugify(size),
      category: slugify(active?.label),
    });
  const sectionHref = (section) =>
    buildHref(sectionPath(section), {
      category: slugify(active?.label),
    });
  const categoryLabel = (label) => label.toUpperCase();
  const submenuLabel = (label) => `${categoryLabel(active?.label || "")}-${label.toUpperCase()}`;

  useEffect(() => {
    if (!searchOpen) {
      setSearchResults([]);
      return;
    }

    const trimmedValue = searchTerm.trim();
    if (!trimmedValue) {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const response = await fetch(`/api/search?query=${encodeURIComponent(trimmedValue)}`);
        const data = await response.json();
        setSearchResults(Array.isArray(data) ? data : []);
      } catch (error) {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 220);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, searchOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: "1.5rem 2rem",
        transition: "all 0.3s ease",
        zIndex: 50,
        backgroundColor: scrolled ? "rgba(0, 0, 0, 0.15)" : "rgba(0,0,0,0.08)",
        backdropFilter: "blur(12px)",
        borderBottom: scrolled ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link href="/" style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "2rem",
            letterSpacing: "0.1em",
            fontWeight: 400,
            color: "inherit",
            textDecoration: "none",
          }}>
            JUNIUS
          </Link>
        </div>

        <div
          onMouseLeave={() => setHoverCategory(null)}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            {categories.map((category) => (
              <button
                key={category.key}
                onMouseEnter={() => setHoverCategory(category.key)}
                style={{
                  padding: "0.85rem 1rem",
                  borderRadius: "999px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  backgroundColor: hoverCategory === category.key ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.08)",
                  color: "inherit",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  transition: "background-color 0.25s ease, transform 0.25s ease",
                }}
              >
                {category.label}
              </button>
            ))}
          </div>

          {active ? (
            <div
              onMouseEnter={() => setHoverCategory(active.key)}
              style={{
                display: "grid",
                gridTemplateColumns: active.key === "newin" ? "repeat(2, minmax(140px, 1fr))" : "repeat(3, minmax(140px, 1fr))",
                gap: "1rem",
                padding: "1.5rem",
                backgroundColor: "rgba(255,255,255,0.06)",
                borderRadius: "24px",
                border: "1px solid rgba(255,255,255,0.1)",
                maxWidth: "900px",
                transition: "opacity 0.2s ease",
                opacity: 1,
              }}
            >
              <div>
                <Link href={sectionHref(active?.sections?.[0] || "dark")} style={{ color: "inherit", textDecoration: "none" }}>
                  <p style={{ fontSize: "0.9rem", letterSpacing: "0.08em", opacity: 0.9, marginBottom: "0.75rem", cursor: "pointer", fontWeight: 600 }}>
                    {`ALL ${categoryLabel(active?.label || "")}`}
                  </p>
                </Link>
                {active.garments.map((item) => (
                  <Link key={item} href={itemHref(item)} style={{ color: "inherit", textDecoration: "none" }}>
                    <p style={{ margin: "0.35rem 0", fontSize: "0.95rem", opacity: 0.85, cursor: "pointer", textTransform: "uppercase" }}>
                      {item}
                    </p>
                  </Link>
                ))}
              </div>

              {active.sizes?.length > 0 && (
                <div>
                  <p style={{ fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", opacity: 0.7, marginBottom: "0.75rem" }}>
                    SIZES
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {active.sizes.map((size) => (
                      <Link key={size} href={sizeHref(size)} style={{ textDecoration: "none" }}>
                        <span style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.85rem",
                          padding: "0.35rem 0.65rem",
                          borderRadius: "999px",
                          border: "1px solid rgba(255,255,255,0.12)",
                          backgroundColor: "rgba(255,255,255,0.05)",
                          opacity: 0.9,
                          cursor: "pointer",
                          color: "inherit",
                          textTransform: "uppercase",
                        }}>
                          {size}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p style={{ fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", opacity: 0.7, marginBottom: "0.75rem" }}>
                  SECTION
                </p>
                {active.sections.map((section) => (
                  <Link key={section} href={sectionHref(section)} style={{ color: "inherit", textDecoration: "none" }}>
                    <p style={{ margin: "0.35rem 0", fontSize: "0.95rem", opacity: 0.85, cursor: "pointer" }}>
                      {section}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", position: "relative" }}>
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setSearchOpen((open) => !open)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "0.9rem",
              letterSpacing: "0.05em",
              fontFamily: "var(--font-inter)",
              color: "inherit"
            }}
          >
            SEARCH
          </button>

          {searchOpen ? (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "calc(100% + 0.75rem)",
                width: "min(380px, 90vw)",
                backgroundColor: isSoft ? "#fbf6f1" : "rgba(10, 10, 10, 0.98)",
                border: isSoft ? "1px solid rgba(20,20,20,0.06)" : "1px solid rgba(255,255,255,0.12)",
                borderRadius: "20px",
                padding: "1rem",
                boxShadow: isSoft ? "0 8px 30px rgba(0,0,0,0.06)" : "0 20px 60px rgba(0,0,0,0.35)",
                color: isSoft ? "#111" : "inherit",
                zIndex: 60,
              }}
            >
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  const trimmedTerm = searchTerm.trim();
                  if (!trimmedTerm) return;
                  try {
                    if (typeof window !== "undefined") {
                      document.title = `SEARCH: ${trimmedTerm}`;
                    }
                  } catch (e) {}
                  setSearchOpen(false);
                  // router.push may not return a promise in some environments, avoid calling .catch on it
                  router.push(`/search?query=${encodeURIComponent(trimmedTerm)}`);
                }}
                style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}
              >
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search for a product..."
                  aria-label="Search products"
                  style={{
                    flex: 1,
                    minWidth: 0,
                    padding: "0.9rem 1rem",
                    borderRadius: "999px",
                    border: isSoft ? "1px solid rgba(0,0,0,0.06)" : "1px solid rgba(255,255,255,0.12)",
                    backgroundColor: isSoft ? "#ffffff" : "rgba(255,255,255,0.05)",
                    color: isSoft ? "#111" : "inherit",
                    outline: "none",
                    fontFamily: "var(--font-inter)",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: "0.9rem 1rem",
                    borderRadius: "999px",
                    border: isSoft ? "1px solid rgba(0,0,0,0.08)" : "1px solid rgba(255,255,255,0.15)",
                    backgroundColor: isSoft ? "#ffffff" : "rgba(255,255,255,0.08)",
                    color: isSoft ? "#111" : "inherit",
                    cursor: "pointer",
                    fontFamily: "var(--font-inter)",
                    letterSpacing: "0.05em",
                  }}
                >
                  SEARCH
                </button>
              </form>

              {searchTerm.trim() ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {searchLoading ? (
                    <p style={{ opacity: 0.7, fontSize: "0.9rem" }}>Searching...</p>
                  ) : searchResults.length > 0 ? (
                    searchResults.slice(0, 5).map((product) => (
                      <Link
                        key={product.handle}
                        href={`/products/${product.handle}`}
                        onClick={() => setSearchOpen(false)}
                        style={{
                          display: "flex",
                          gap: "0.75rem",
                          alignItems: "center",
                          padding: "0.75rem 0.85rem",
                          borderRadius: "18px",
                          textDecoration: "none",
                          color: isSoft ? "#111" : "inherit",
                          backgroundColor: isSoft ? "#ffffff" : "rgba(255,255,255,0.03)",
                        }}
                      >
                        <div style={{ width: 42, height: 42, borderRadius: 12, overflow: "hidden", backgroundColor: isSoft ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.05)" }}>
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.title}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          ) : null}
                        </div>
                        <div>
                          <p style={{ margin: 0, fontSize: "0.95rem", fontWeight: 600 }}>{product.title}</p>
                          <p style={{ margin: 0, fontSize: "0.8rem", opacity: isSoft ? 0.7 : 0.7, color: isSoft ? "#333" : "inherit" }}>{product.price}</p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p style={{ opacity: 0.7, fontSize: "0.9rem", color: isSoft ? "#222" : "inherit" }}>
                      {`No results found for "${searchTerm.trim()}".`}
                    </p>
                  )}
                </div>
              ) : (
                <p style={{ opacity: 0.7, fontSize: "0.9rem", margin: 0, color: isSoft ? "#222" : "inherit" }}>Type something to see matching products.</p>
              )}
            </div>
          ) : null}
        </div>

        <button
          onClick={openCart}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "0.9rem",
            letterSpacing: "0.05em",
            fontFamily: "var(--font-inter)",
            color: "inherit"
          }}
        >
          CART ({cart?.lines?.edges?.length || 0})
        </button>
      </div>
    </nav>
  );
}
