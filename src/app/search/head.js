export default function Head({ searchParams }) {
  const query = searchParams?.query?.toString()?.trim() || "";
  return <title>{query ? `SEARCH: ${query}` : "SEARCH"}</title>;
}
