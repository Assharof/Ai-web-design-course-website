import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Assharof Online Academy | AI Website Building Course",
  description: "A premium student learning space for the AI Website Building Course.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#f8fbfa] text-slate-900 antialiased">{children}</body>
    </html>
  );
}
