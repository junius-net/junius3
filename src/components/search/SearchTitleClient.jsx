"use client";

import { useEffect } from "react";

export default function SearchTitleClient({ query }) {
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        document.title = query ? `SEARCH: ${query}` : "SEARCH";
      }
    } catch (e) {}
  }, [query]);

  return null;
}
