import Link from "next/link";

type AuthFormProps = {
  title: string;
  description: string;
  submitLabel: string;
  passwordAutoComplete: "current-password" | "new-password";
  switchText: string;
  switchHref: string;
  switchLabel: string;
};

export function AuthForm({
  title,
  description,
  submitLabel,
  passwordAutoComplete,
  switchText,
  switchHref,
  switchLabel,
}: AuthFormProps) {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center px-6 py-12">
      <section className="grid w-full items-center gap-10 lg:grid-cols-[1fr_26rem]">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-wider text-gray-500">TinyNotes</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-gray-950 sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-lg leading-8 text-gray-600">{description}</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <form className="space-y-5" method="post">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-800">
                Email cim
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-950 outline-none transition focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10"
                placeholder="nev@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-800">
                Jelszo
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={passwordAutoComplete}
                required
                minLength={8}
                className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-950 outline-none transition focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10"
                placeholder="Legalabb 8 karakter"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2"
            >
              {submitLabel}
            </button>
          </form>

          <div className="mt-6 border-t border-gray-200 pt-5">
            <p className="text-sm text-gray-600">{switchText}</p>
            <Link
              href={switchHref}
              className="mt-3 inline-flex w-full items-center justify-center rounded-md border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2"
            >
              {switchLabel}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
