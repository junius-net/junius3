"use client";

import { useCart } from "./CartContext";
import { useEffect } from "react";

export default function CartDrawer() {
  const { isOpen, closeCart, cart } = useCart();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={closeCart}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 999,
          backdropFilter: "blur(2px)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.3s ease"
        }} 
      />
      
      {/* Drawer */}
      <div style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        maxWidth: "400px",
        backgroundColor: "var(--dark-black)",
        color: "var(--dark-silver)",
        zIndex: 1000,
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        boxShadow: "-5px 0 15px rgba(0,0,0,0.5)",
        transform: isOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.4s cubic-bezier(0.77, 0, 0.175, 1)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "2rem", fontWeight: 400 }}>Your Cart</h2>
          <button onClick={closeCart} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", fontSize: "2rem", fontWeight: 300 }}>×</button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", fontFamily: "var(--font-inter)" }}>
          {cart && cart.lines.edges.length > 0 ? (
            <div>
              {/* map cart items */}
              <p>Items in cart will appear here.</p>
            </div>
          ) : (
            <div style={{ textAlign: "center", marginTop: "4rem", opacity: 0.7 }}>
              <p style={{ marginBottom: "1rem" }}>Your cart is empty.</p>
              <p style={{ fontSize: "0.85rem", fontStyle: "italic" }}>Complements your mood.</p>
            </div>
          )}
        </div>

        <div style={{ marginTop: "auto", paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <button style={{
            width: "100%",
            padding: "1rem",
            backgroundColor: "var(--dark-silver)",
            color: "var(--dark-black)",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-inter)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            transition: "opacity 0.2s ease"
          }}>
            Checkout
          </button>
        </div>
      </div>
    </>
  );
}
