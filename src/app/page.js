"use client";
import { useState, useEffect } from "react";

export default function HomePage() {
  // Aquí están tus 4 productos de prueba
  const products = [
    { id: 1, title: "Camiseta Básica Negra", price: "$20.00", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80" },
    { id: 2, title: "Sudadera Oversize", price: "$45.00", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=400&q=80" },
    { id: 3, title: "Pantalón Cargo", price: "$50.00", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=400&q=80" },
    { id: 4, title: "Chaqueta de Cuero", price: "$120.00", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=400&q=80" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // LA MAGIA DEL LOOP: Cambia de foto cada 3 segundos y vuelve a la primera
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === products.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);
    return () => clearInterval(timer);
  }, [products.length]);

  const currentProduct = products[currentIndex];

  return (
    <main style={{ padding: "4rem 2rem", fontFamily: "sans-serif", backgroundColor: "#fafafa", minHeight: "100vh" }}>
      <div style={{ maxWidth: "400px", margin: "0 auto", textAlign: "center" }}>
        
        <h1 style={{ fontSize: "2rem", marginBottom: "2rem", fontWeight: "bold" }}>Nueva Colección</h1>
        
        {/* Tarjeta del Producto */}
        <div style={{ backgroundColor: "white", padding: "1rem", borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          
          {/* Espacio Cuadrado para la Foto */}
          <div style={{ aspectRatio: "1 / 1", overflow: "hidden", borderRadius: "8px", marginBottom: "1rem" }}>
            <img 
              src={currentProduct.image} 
              alt={currentProduct.title} 
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          
          {/* Título y Precio */}
          <h2 style={{ fontSize: "1.2rem", margin: "0.5rem 0" }}>{currentProduct.title}</h2>
          <p style={{ fontSize: "1.1rem", color: "#555", marginBottom: "1.5rem" }}>{currentProduct.price}</p>
          
          {/* Botón Negro */}
          <button style={{ 
            backgroundColor: "black", 
            color: "white", 
            width: "100%", 
            padding: "1rem", 
            border: "none", 
            borderRadius: "8px", 
            fontSize: "1rem", 
            fontWeight: "bold",
            cursor: "pointer" 
          }}>
            Agregar al carrito
          </button>

        </div>

        {/* Indicadores del Carrusel (Puntitos) */}
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "1.5rem" }}>
          {products.map((_, index) => (
            <div 
              key={index} 
              style={{
                width: "10px", 
                height: "10px", 
                borderRadius: "50%", 
                backgroundColor: currentIndex === index ? "black" : "#ccc"
              }}
            />
          ))}
        </div>

      </div>
    </main>
  );
}