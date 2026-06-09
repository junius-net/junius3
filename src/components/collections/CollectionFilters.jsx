"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

export default function CollectionFilters() {
  const [open, setOpen] = useState({
    product: true,
    color: false,
    size: false,
    price: false,
    availability: false,
    sort: true,
  });

  const toggle = (key) => setOpen((s) => ({ ...s, [key]: !s[key] }));

  const ACCENT = "#7b61ff";

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const slugify = (value) =>
    value
      ?.toString()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "") || "";

  const selectedFilter = searchParams?.get("filter") ? slugify(searchParams.get("filter")) : "";
  const selectedSize = searchParams?.get("size") ? slugify(searchParams.get("size")) : "";
  const selectedCategory = searchParams?.get("category") ? slugify(searchParams.get("category")) : "";
  const selectedSection = pathname?.split("/")[2] ? slugify(pathname.split("/")[2]) : "";
  const showSizeSection = selectedCategory !== "accessories";

  useEffect(() => {
    setOpen({
      product: Boolean(selectedFilter),
      color: Boolean(selectedSection),
      size: showSizeSection && Boolean(selectedSize),
      price: false,
      availability: false,
      sort: true,
    });
  }, [pathname, searchParams?.toString(), selectedFilter, selectedSize, selectedSection, showSizeSection]);

  const updateQuery = (nextPath, updates) => {
    const nextParams = new URLSearchParams(searchParams?.toString() || "");

    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        nextParams.delete(key);
      } else {
        nextParams.set(key, value);
      }
    });

    if (selectedCategory) {
      nextParams.set("category", selectedCategory);
    }

    const queryString = nextParams.toString();
    router.push(queryString ? `${nextPath}?${queryString}` : nextPath);
  };

  const handleCheckboxChange = (group, value) => {
    if (group === "product") {
      updateQuery(pathname, {
        filter: selectedFilter === value ? "" : value,
      });
      return;
    }

    if (group === "size") {
      updateQuery(pathname, {
        size: selectedSize === value ? "" : value,
      });
      return;
    }

    if (group === "section") {
      updateQuery(`/collections/${value}`, {
        filter: selectedFilter || "",
        size: selectedSize || "",
      });
      return;
    }
  };

  const PRICE_MIN = 0;
  const PRICE_MAX = 100;
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(100);
  const [activeThumb, setActiveThumb] = useState(null); // 'min' | 'max' | null
  const trackRef = useRef(null);
  const movingRef = useRef(false);
  const activeRef = useRef(null);

  useEffect(() => {
    const clear = () => setActiveThumb(null);
    window.addEventListener("mouseup", clear);
    window.addEventListener("touchend", clear);
    return () => {
      window.removeEventListener("mouseup", clear);
      window.removeEventListener("touchend", clear);
    };
  }, []);

  // Pointer-based dragging over the track to avoid native input overlap issues
  useEffect(() => {
    let moving = false;
    let active = null;

    const clampPosToValue = (clientX) => {
      const el = trackRef.current;
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const trackLeft = rect.left + 8; // inner track inset
      const trackWidth = Math.max(1, rect.width - 16);
      const pos = (clientX - trackLeft) / trackWidth;
      const pct = Math.max(0, Math.min(1, pos));
      const value = Math.round(PRICE_MIN + pct * (PRICE_MAX - PRICE_MIN));
      return clamp(value, PRICE_MIN, PRICE_MAX);
    };

    const onPointerMove = (e) => {
      if (!moving) return;
      const v = clampPosToValue(e.clientX);
      if (v === null) return;
      if (active === 'min') {
        const next = Math.min(v, priceMax);
        setPriceMin(next);
      } else if (active === 'max') {
        const next = Math.max(v, priceMin);
        setPriceMax(next);
      }
    };

    const onPointerUp = () => {
      moving = false;
      active = null;
      setActiveThumb(null);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    const onPointerDown = (e) => {
      if (!trackRef.current) return;
      e.preventDefault();
      const v = clampPosToValue(e.clientX);
      if (v === null) return;
      // choose closest thumb to pointer
      const distMin = Math.abs(v - priceMin);
      const distMax = Math.abs(v - priceMax);
      active = distMin <= distMax ? 'min' : 'max';
      moving = true;
      setActiveThumb(active);
      if (active === 'min') setPriceMin(Math.min(v, priceMax));
      else setPriceMax(Math.max(v, priceMin));
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
    };

    const el = trackRef.current;
    if (el) {
      el.addEventListener('pointerdown', onPointerDown);
    }

    return () => {
      if (el) el.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [priceMin, priceMax]);

  const startDrag = (which, e) => {
    e.preventDefault();
    movingRef.current = true;
    activeRef.current = which;
    setActiveThumb(which);

    const onMove = (ev) => {
      const v = (() => {
        const el = trackRef.current;
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        const trackLeft = rect.left + 8;
        const trackWidth = Math.max(1, rect.width - 16);
        const pos = (ev.clientX - trackLeft) / trackWidth;
        const pct = Math.max(0, Math.min(1, pos));
        const value = Math.round(PRICE_MIN + pct * (PRICE_MAX - PRICE_MIN));
        return clamp(value, PRICE_MIN, PRICE_MAX);
      })();
      if (v === null) return;
      if (activeRef.current === 'min') {
        setPriceMin(Math.min(v, priceMax));
      } else if (activeRef.current === 'max') {
        setPriceMax(Math.max(v, priceMin));
      }
    };

    const onUp = () => {
      movingRef.current = false;
      activeRef.current = null;
      setActiveThumb(null);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    try { e.target.setPointerCapture && e.target.setPointerCapture(e.pointerId); } catch (err) {}
  };

  const clamp = (v, a, b) => Math.max(a, Math.min(b, Number(v) || 0));

  const onMinInput = (v) => {
    const next = clamp(v, PRICE_MIN, priceMax);
    setPriceMin(next);
  };

  const onMaxInput = (v) => {
    const next = clamp(v, priceMin, PRICE_MAX);
    setPriceMax(next);
  };

  return (
    <aside style={{ padding: "0 0 1rem 0", width: 280, marginTop: 0, height: "100%" }}>
      <div style={{ borderRight: "1px solid rgba(150,150,150,0.08)", paddingRight: "1.5rem", paddingLeft: "1rem", paddingTop: 0, height: "100%", backgroundColor: "rgba(255,255,255,0.02)", borderRadius: "0 24px 24px 0", display: "flex", flexDirection: "column", justifyContent: "flex-start", ['--filter-accent']: ACCENT, textTransform: "uppercase" }}>
        <div style={{ borderBottom: "1px solid rgba(150,150,150,0.08)", paddingBottom: "0.75rem", marginBottom: "0.75rem" }}>
          <h3 style={{ margin: 0, fontSize: "1.1rem", letterSpacing: "0.08em" }}>Filters</h3>
        </div>
        <div onClick={() => toggle("product")} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 0", cursor: "pointer" }}>
          <h4 style={{ margin: 0, fontSize: "0.95rem" }}>Product type</h4>
          <button onClick={(e) => { e.stopPropagation(); toggle("product"); }} style={{ background: "none", border: "none", cursor: "pointer", width: 28, height: 28, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", lineHeight: 1, color: "var(--filter-accent)" }}>{open.product ? "-" : "+"}</button>
        </div>
        {open.product && (
          <div style={{ padding: "0.5rem 0" }}>
            {[
              { label: "Baby tees", value: "baby-tees" },
              { label: "Polo", value: "polo" },
              { label: "Blouses", value: "blouses" },
              { label: "T-shirts", value: "t-shirts" },
            ].map((item) => (
              <label key={item.value} style={{ display: "flex", alignItems: "center", gap: "0.5rem", margin: "0.5rem 0" }}>
                <input
                  type="checkbox"
                  checked={selectedFilter === item.value}
                  onChange={() => handleCheckboxChange("product", item.value)}
                  style={{ accentColor: "var(--filter-accent)" }}
                />
                {item.label}
              </label>
            ))}
          </div>
        )}

        <div style={{ borderTop: "1px solid rgba(150,150,150,0.06)", marginTop: "0.5rem", paddingTop: "0.5rem" }}>
          <div onClick={() => toggle("color")} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0", cursor: "pointer" }}>
            <h4 style={{ margin: 0 }}>Section</h4>
            <button onClick={(e) => { e.stopPropagation(); toggle("color"); }} style={{ background: "none", border: "none", cursor: "pointer", width: 28, height: 28, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", lineHeight: 1, color: "var(--filter-accent)" }}>{open.color ? "-" : "+"}</button>
          </div>
          {open.color && (
            <div style={{ padding: "0.5rem 0" }}>
              {[
                { label: "DARK", value: "dark" },
                { label: "SOFT", value: "soft" },
              ].map((item) => (
                <label key={item.value} style={{ display: "flex", alignItems: "center", gap: "0.5rem", margin: "0.5rem 0" }}>
                  <input
                    type="checkbox"
                    checked={selectedSection === item.value}
                    onChange={() => handleCheckboxChange("section", item.value)}
                    style={{ accentColor: "var(--filter-accent)" }}
                  />
                  {item.label}
                </label>
              ))}
            </div>
          )}
        </div>

        {showSizeSection ? (
          <div style={{ borderTop: "1px solid rgba(150,150,150,0.06)", marginTop: "0.5rem", paddingTop: "0.5rem" }}>
            <div onClick={() => toggle("size")} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0", cursor: "pointer" }}>
              <h4 style={{ margin: 0 }}>Size</h4>
              <button onClick={(e) => { e.stopPropagation(); toggle("size"); }} style={{ background: "none", border: "none", cursor: "pointer", width: 28, height: 28, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", lineHeight: 1, color: "var(--filter-accent)" }}>{open.size ? "-" : "+"}</button>
            </div>
            {open.size && (
              <div style={{ padding: "0.5rem 0" }}>
                {[
                  "XXS",
                  "XS",
                  "S",
                  "M",
                  "L",
                  "XL",
                ].map((size) => {
                  const value = slugify(size);
                  return (
                    <label key={size} style={{ display: "flex", alignItems: "center", gap: "0.5rem", margin: "0.5rem 0" }}>
                      <input
                        type="checkbox"
                        checked={selectedSize === value}
                        onChange={() => handleCheckboxChange("size", value)}
                        style={{ accentColor: "var(--filter-accent)" }}
                      />
                      {size}
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        ) : null}

        <div style={{ borderTop: "1px solid rgba(150,150,150,0.06)", marginTop: "0.5rem", paddingTop: "0.5rem" }}>
          <div onClick={() => toggle("price")} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0", cursor: "pointer" }}>
            <h4 style={{ margin: 0 }}>Price (USD)</h4>
            <button onClick={(e) => { e.stopPropagation(); toggle("price"); }} style={{ background: "none", border: "none", cursor: "pointer", width: 28, height: 28, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", lineHeight: 1, color: "var(--filter-accent)" }}>{open.price ? "-" : "+"}</button>
          </div>
          {open.price && (
            <div style={{ padding: "0.5rem 0", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.85rem" }}>$</label>
                  <input
                    type="number"
                    value={priceMin}
                    min={PRICE_MIN}
                    max={priceMax}
                    onChange={(e) => onMinInput(e.target.value)}
                    style={{ width: 90, padding: "0.35rem 0.5rem", borderRadius: 6, border: "1px solid rgba(150,150,150,0.08)", background: "transparent", color: "inherit" }}
                  />
                </div>

                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.85rem" }}>$</label>
                  <input
                    type="number"
                    value={priceMax}
                    min={priceMin}
                    max={PRICE_MAX}
                    onChange={(e) => onMaxInput(e.target.value)}
                    style={{ width: 90, padding: "0.35rem 0.5rem", borderRadius: 6, border: "1px solid rgba(150,150,150,0.08)", background: "transparent", color: "inherit" }}
                  />
                </div>
              </div>

              <div ref={trackRef} style={{ position: "relative", height: 36, display: "flex", alignItems: "center" }}>
                {/* custom thumbs (replace native range inputs) */}
                <div
                  role="slider"
                  aria-label="Minimum price"
                  aria-valuemin={PRICE_MIN}
                  aria-valuemax={PRICE_MAX}
                  aria-valuenow={priceMin}
                  tabIndex={0}
                  onPointerDown={(e) => startDrag('min', e)}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: `${(priceMin / PRICE_MAX) * 100}%`,
                    transform: "translate(-50%, -50%)",
                    width: 18,
                    height: 18,
                    borderRadius: 18,
                    background: "var(--filter-accent)",
                    boxShadow: "0 0 0 6px rgba(123,97,255,0.08)",
                    cursor: "pointer",
                    zIndex: activeThumb === "min" ? 6 : 4,
                  }}
                />
                <div
                  role="slider"
                  aria-label="Maximum price"
                  aria-valuemin={PRICE_MIN}
                  aria-valuemax={PRICE_MAX}
                  aria-valuenow={priceMax}
                  tabIndex={0}
                  onPointerDown={(e) => startDrag('max', e)}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: `${(priceMax / PRICE_MAX) * 100}%`,
                    transform: "translate(-50%, -50%)",
                    width: 18,
                    height: 18,
                    borderRadius: 18,
                    background: "var(--filter-accent)",
                    boxShadow: "0 0 0 6px rgba(123,97,255,0.08)",
                    cursor: "pointer",
                    zIndex: activeThumb === "max" ? 6 : 4,
                  }}
                />
                <div style={{ position: "absolute", left: 8, right: 8, height: 6, borderRadius: 6, background: "rgba(255,255,255,0.06)" }} />
                <div
                  style={{
                    position: "absolute",
                    height: 6,
                    borderRadius: 6,
                    background: "linear-gradient(90deg, var(--filter-accent), var(--filter-accent))",
                    left: `${(priceMin / PRICE_MAX) * 100}%`,
                    right: `${100 - (priceMax / PRICE_MAX) * 100}%`,
                    marginLeft: 8,
                    marginRight: 8,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div style={{ borderTop: "1px solid rgba(150,150,150,0.06)", marginTop: "0.5rem", paddingTop: "0.5rem" }}>
          <div onClick={() => toggle("availability")} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0", cursor: "pointer" }}>
            <h4 style={{ margin: 0 }}>Availability</h4>
            <button onClick={(e) => { e.stopPropagation(); toggle("availability"); }} style={{ background: "none", border: "none", cursor: "pointer", width: 28, height: 28, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", lineHeight: 1, color: "var(--filter-accent)" }}>{open.availability ? "-" : "+"}</button>
          </div>
          {open.availability && (
            <div style={{ padding: "0.5rem 0" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", margin: "0.5rem 0" }}>
                <input type="checkbox" />
                In stock
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", margin: "0.5rem 0" }}>
                <input type="checkbox" />
                Coming soon
              </label>
            </div>
          )}
        </div>

        <div style={{ borderTop: "1px solid rgba(150,150,150,0.06)", marginTop: "0.5rem", paddingTop: "0.5rem" }}>
          <div onClick={() => toggle("sort")} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0", cursor: "pointer" }}>
            <h4 style={{ margin: 0 }}>Sort by</h4>
            <button onClick={(e) => { e.stopPropagation(); toggle("sort"); }} style={{ background: "none", border: "none", cursor: "pointer", width: 28, height: 28, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", lineHeight: 1, color: "var(--filter-accent)" }}>{open.sort ? "-" : "+"}</button>
          </div>
          {open.sort && (
            <div style={{ padding: "0.5rem 0" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: "0.6rem 0" }}>
                <input type="radio" name="sort" /> Most relevant
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: "0.6rem 0" }}>
                <input type="radio" name="sort" /> Best selling
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: "0.6rem 0" }}>
                <input type="radio" name="sort" /> Alphabetical, A-Z
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: "0.6rem 0" }}>
                <input type="radio" name="sort" /> Alphabetical, Z-A
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: "0.6rem 0" }}>
                <input type="radio" name="sort" /> Price, low to high
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: "0.6rem 0" }}>
                <input type="radio" name="sort" /> Price, high to low
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: "0.6rem 0" }}>
                <input type="radio" name="sort" /> Date: old to new
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: "0.6rem 0" }}>
                <input type="radio" name="sort" /> Date: new to old
              </label>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
