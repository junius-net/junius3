import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{
      padding: "4rem 2rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      borderTop: "1px solid rgba(150, 150, 150, 0.2)",
      marginTop: "5rem"
    }}>
      <h3 style={{ 
        fontFamily: "var(--font-cormorant), serif", 
        fontSize: "2.5rem", 
        marginBottom: "1rem",
        fontWeight: 300 
      }}>
        JUNIUS
      </h3>
      <p style={{ 
        fontSize: "0.9rem", 
        opacity: 0.7, 
        marginBottom: "3rem",
        letterSpacing: "0.05em"
      }}>
        Somewhere between the surface and the sky
      </p>

      <div style={{
        display: "flex",
        gap: "3rem",
        fontSize: "0.85rem",
        letterSpacing: "0.05em",
        opacity: 0.8
      }}>
        <Link href="/collections/dark">DARK LINE</Link>
        <Link href="/collections/soft">SOFT LINE</Link>
        <Link href="/about">ABOUT</Link>
        <Link href="/shipping">SHIPPING</Link>
        <Link href="/terms">TERMS</Link>
      </div>
      
      <p style={{ marginTop: "4rem", fontSize: "0.75rem", opacity: 0.5 }}>
        © {new Date().getFullYear()} JUNIUS. All rights reserved.
      </p>
    </footer>
  );
}
