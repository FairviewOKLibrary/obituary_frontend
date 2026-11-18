import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/globals.scss";

const geistSans = localFont({ src: "./fonts/GeistVF.woff", variable: "--font-geist", weight: "100 900", display: "swap" });
export const metadata: Metadata = {
  title: "Obituary Collection | Fairview City Library",
  description: "Search obituary notices and historical records in the Fairview City Library local history collection. Discover family stories and remember community members.",
  robots: { index: true, follow: true },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={geistSans.variable}>{children}</body></html>;
}
