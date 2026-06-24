export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-white text-gray-950">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-6 py-10">
        <header className="border-b border-gray-200 pb-6">
          <p className="text-sm font-medium uppercase tracking-wider text-gray-500">
            TinyNotes public
          </p>
        </header>
        <div className="flex flex-1 flex-col justify-center py-12">{children}</div>
      </div>
    </main>
  );
}
