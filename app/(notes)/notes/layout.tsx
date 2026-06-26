import Link from "next/link";

export default function NotesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-8">
      <div className="grid gap-8 lg:grid-cols-[14rem_1fr]">
        <aside className="lg:border-r lg:border-gray-200 lg:pr-6">
          <nav aria-label="Jegyzetek" className="flex gap-2 lg:flex-col">
            <Link
              href="/notes"
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-950"
            >
              Jegyzetek
            </Link>
            <Link
              href="/notes/new"
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-950"
            >
              Uj jegyzet
            </Link>
          </nav>
        </aside>
        <section className="min-w-0">
          <header className="mb-8 border-b border-gray-200 pb-5">
            <p className="text-sm font-medium uppercase tracking-wider text-gray-500">
              Munkaterulet
            </p>
            <p className="mt-2 max-w-2xl text-sm text-gray-600">
              Sajat jegyzetek kezelese, szerkesztese es megosztasa.
            </p>
          </header>
          {children}
        </section>
      </div>
    </main>
  );
}
