import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TinyNotes",
  description: "TinyNotes application shell",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu">
      <body>{children}</body>
    </html>
  );
}
