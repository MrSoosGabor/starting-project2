export default function NotesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-950">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-8">
        <header className="border-b border-gray-200 pb-6">
          <p className="text-sm font-medium uppercase tracking-wider text-gray-500">
            TinyNotes notes
          </p>
        </header>
        <div className="flex-1 py-10">{children}</div>
      </div>
    </main>
  );
}
