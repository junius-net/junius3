"use client";

import { useState } from "react";

export default function ProductForm({ product }) {
  const [selectedOptions, setSelectedOptions] = useState({});

  const handleOptionSelect = (name, value) => {
    setSelectedOptions(prev => ({ ...prev, [name]: value }));
  };

  const handleAddToCart = () => {
    console.log("Add to cart", product, selectedOptions);
    // integrate with cart context soon
  };

  return (
    <div>
      {product.options.map(option => (
        <div key={option.id} style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ fontSize: "0.9rem", marginBottom: "0.5rem", letterSpacing: "0.05em", fontFamily: "var(--font-inter)", textTransform: "uppercase" }}>
            {option.name}
          </h3>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {option.values.map(value => (
              <button
                key={value}
                onClick={() => handleOptionSelect(option.name, value)}
                style={{
                  padding: "0.5rem 1rem",
                  background: selectedOptions[option.name] === value ? "currentColor" : "transparent",
                  color: selectedOptions[option.name] === value ? "var(--dark-black)" : "inherit", 
                  border: "1px solid currentColor",
                  cursor: "pointer",
                  fontFamily: "var(--font-inter)",
                  borderRadius: "3px",
                  transition: "all 0.2s ease"
                }}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      ))}

      <button 
        onClick={handleAddToCart}
        style={{
          width: "100%",
          padding: "1rem",
          marginTop: "1rem",
          background: "currentColor",
          color: "var(--soft-pearl)", // placeholder inverted color
          border: "none",
          cursor: "pointer",
          letterSpacing: "0.1em",
          fontFamily: "var(--font-inter)",
          textTransform: "uppercase"
        }}
      >
        Add to Cart
      </button>
    </div>
  );
}
