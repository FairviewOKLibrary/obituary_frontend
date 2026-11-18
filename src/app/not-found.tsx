import Link from "next/link";
export default function NotFound() {
  return <main style={{ minHeight: "70vh", display: "grid", placeContent: "center", textAlign: "center", padding: "3rem" }}><h1>Page not found</h1><p>This page isn’t in the obituary collection.</p><Link href="/" style={{ marginTop: "1rem", textDecoration: "underline" }}>Return to the collection</Link></main>;
}
