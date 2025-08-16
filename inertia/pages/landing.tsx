import { Head, Link } from '@inertiajs/react'

export default function Landing() {
  return (
    <div className="min-h-screen bg-[var(--brand-bg)] text-[var(--brand-text)]">
      <Head title="Nooklet — Capture small ideas. Build big momentum." />

      <header className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="font-semibold tracking-tight">Nooklet</div>
        <nav className="text-sm opacity-80 space-x-4">
          <a href="/register" className="hover:opacity-100">Get started</a>
          <a href="/login" className="hover:opacity-100">Log in</a>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-10 pb-20 grid gap-10">
        <section className="text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl font-semibold leading-tight">
            Capture small ideas. Build big momentum.
          </h1>
          <p className="text-[var(--color-slate-300)] max-w-2xl mx-auto">
            Nooklet is your minimalist, AI‑ready second brain: fast capture, gentle structure,
            and privacy‑first publishing when you’re ready.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/register"
              className="btn btn-primary"
            >
              Get started — it’s free
            </Link>
            <a
              href="#features"
              className="btn btn-outline"
            >
              Learn more
            </a>
          </div>
        </section>

        <section id="features" className="grid sm:grid-cols-3 gap-4 text-sm">
          <div className="rounded-lg border border-[var(--color-gray-800)] p-4 bg-[var(--color-navy-950)]/40">
            <div className="font-medium mb-1">Fast capture</div>
            <p className="opacity-80">Create a nooklet in seconds with a clean, focused editor.</p>
          </div>
          <div className="rounded-lg border border-[var(--color-gray-800)] p-4 bg-[var(--color-navy-950)]/40">
            <div className="font-medium mb-1">Organized by design</div>
            <p className="opacity-80">Tags and timelines keep your ideas findable without friction.</p>
          </div>
          <div className="rounded-lg border border-[var(--color-gray-800)] p-4 bg-[var(--color-navy-950)]/40">
            <div className="font-medium mb-1">Privacy‑first</div>
            <p className="opacity-80">Draft privately. Publish when ready. Always reversible.</p>
          </div>
        </section>
      </main>

      <footer className="text-center text-xs opacity-60 py-6">
        © {new Date().getFullYear()} Nooklet
      </footer>
    </div>
  )
}

