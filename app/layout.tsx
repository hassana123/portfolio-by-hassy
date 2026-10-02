import type { Metadata } from "next";
import "./globals.css";
import { siteUrl } from "@/lib/data";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: "Hassana Abdullahi", template: "%s · Hassana Abdullahi" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Unbounded:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Mrs+Saint+Delafield&display=swap"
          rel="stylesheet"
        />
        <link
          rel="preload"
          as="image"
          href="/demo/about.jpg"
          fetchPriority="high"
        />
      </head>
      {/* Browser extensions can add body attributes before React hydrates.
          Suppression is scoped to this element; child mismatches still warn. */}
      <body suppressHydrationWarning>
        <a className="skip" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
