"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTheme } from "@/components/theme/ThemeProvider";

const titleCase = (value) =>
  value
    ? value
        .toString()
        .replace(/-/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase())
    : "";

const buildTitle = ({ category, filter, size, section, collectionTitle }) => {
  const categoryLabel = category ? category.replace(/-/g, " ").toUpperCase() : null;
  const sectionLabel = section ? section.toUpperCase() : null;
  const filterLabel = filter ? titleCase(filter) : null;
  const sizeLabel = size ? titleCase(size) : null;

  if (categoryLabel && sectionLabel) {
    return `ALL ${categoryLabel} - ${sectionLabel}`;
  }

  const base = filterLabel || sizeLabel || "ALL";
  const title = sectionLabel ? `${base} - ${sectionLabel}` : base;

  return title || titleCase(collectionTitle) || "Collection";
};

export default function CollectionHeader({
  section,
  pageTitle,
  category,
  filter,
  size,
  collectionTitle,
  collectionDescription,
  isEmpty,
}) {
  const searchParams = useSearchParams();
  const filterParam = filter || searchParams?.get("filter");
  const sizeParam = size || searchParams?.get("size");
  const categoryParam = category || searchParams?.get("category");
  const { setTheme } = useTheme();
  const sectionName = section || searchParams?.get("section");

  const title = buildTitle({
    category: categoryParam,
    filter: filterParam,
    size: sizeParam,
    section: sectionName,
    collectionTitle,
  });
  const message = collectionDescription;

  useEffect(() => {
    if (section === "soft") {
      setTheme("theme-soft");
    } else {
      setTheme("theme-dark");
    }
  }, [section, setTheme]);

  return (
    <section style={{ textAlign: "center", margin: "0 auto", maxWidth: "720px" }}>
      <h1 style={{ fontSize: "4rem", marginBottom: "1rem", textTransform: "uppercase" }}>{title}</h1>
      {message ? (
        <p
          style={{
            fontFamily: "var(--font-inter)",
            opacity: 0.85,
            maxWidth: "600px",
            margin: "0 auto 2.5rem",
            lineHeight: 1.8,
          }}
        >
          {message}
        </p>
      ) : null}
      {/* Header no muestra botón de vuelta al inicio; el control está en el área de productos. */}
    </section>
  );
}
