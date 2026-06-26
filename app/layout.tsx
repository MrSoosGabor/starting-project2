import type { Metadata } from "next";
import Link from "next/link";
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
      <body className="min-h-screen bg-gray-50 text-gray-950">
        <div className="flex min-h-screen flex-col">
          <header className="border-b border-gray-200 bg-white">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-4">
              <Link href="/" className="text-xl font-semibold tracking-tight">
                TinyNotes
              </Link>
              <nav aria-label="Fiók" className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-950"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-md bg-gray-950 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                  Register
                </Link>
              </nav>
            </div>
          </header>
          <div className="flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}
