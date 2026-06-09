"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import Link from "next/link";

export default function HomeSections() {
  const { setTheme } = useTheme();
  const darkRef = useRef(null);
  const softRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.id === "section-dark") {
            setTheme("theme-dark");
          } else if (entry.target.id === "section-soft") {
            setTheme("theme-soft");
          }
        }
      });
    }, { threshold: 0.5 });

    if (darkRef.current) observer.observe(darkRef.current);
    if (softRef.current) observer.observe(softRef.current);

    return () => observer.disconnect();
  }, [setTheme]);

  return (
    <main style={{ width: "100%", overflowX: "hidden" }}>
      {/* DARK SECTION */}
      <section 
        id="section-dark" 
        ref={darkRef}
        style={{ 
          minHeight: "100vh", 
          display: "flex", 
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
          textAlign: "center"
        }}
      >
        <h1 style={{ fontSize: "5rem", marginBottom: "1rem", marginTop: "10vh" }}>The Hour Before Dawn</h1>
        <p style={{ fontFamily: "var(--font-inter)", maxWidth: "550px", opacity: 0.8, marginBottom: "3rem", lineHeight: 1.6 }}>
          Wear something that needs no explanation. JUNIUS DARK brings oversized fits, deep blacks, and iridescent dragonfly motifs, fusing underground streetwear with a silent aesthetic.
        </p>
        <Link href="/collections/dark" style={{
          padding: "1rem 3rem",
          border: "1px solid var(--dark-silver)",
          borderRadius: "50px",
          letterSpacing: "0.1em",
          fontSize: "0.85rem",
          transition: "all 0.3s ease",
          textTransform: "uppercase"
        }}>
          Explore Dark
        </Link>
      </section>

      {/* SOFT SECTION */}
      <section 
        id="section-soft" 
        ref={softRef}
        style={{ 
          minHeight: "100vh", 
          display: "flex", 
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
          textAlign: "center"
        }}
      >
        <h1 style={{ fontSize: "5rem", marginBottom: "1rem" }}>Light Caught Midair</h1>
        <p style={{ fontFamily: "var(--font-inter)", maxWidth: "550px", opacity: 0.8, marginBottom: "3rem", lineHeight: 1.6 }}>
          Never quite in one place. JUNIUS SOFT features delicate botanical illustrations, fitted baby tees, and sage green hues inspired by 19th-century nature and Japanese analog photography.
        </p>
        <Link href="/collections/soft" style={{
          padding: "1rem 3rem",
          border: "1px solid #333",
          borderRadius: "50px",
          letterSpacing: "0.1em",
          fontSize: "0.85rem",
          transition: "all 0.3s ease",
          textTransform: "uppercase"
        }}>
          Explore Soft
        </Link>
      </section>
    </main>
  );
}
