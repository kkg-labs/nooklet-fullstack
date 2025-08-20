import { Head, Link } from "@inertiajs/react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <Head title="Nooklet — Capture small ideas. Build big momentum." />

      <header className="navbar bg-base-100 border-b border-base-300">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex-1">
            <a href="/" className="btn btn-ghost normal-case text-xl">
              Nooklet
            </a>
          </div>
          <nav className="flex items-center gap-2">
            <a href="/login" className="btn btn-ghost btn-sm">
              Log in
            </a>
            <a href="/register" className="btn btn-primary btn-sm">
              Get started
            </a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 pt-12 pb-20 grid gap-10">
        <section className="hero">
          <div className="hero-content text-center">
            <div className="max-w-2xl">
              <h1 className="text-4xl sm:text-5xl font-semibold leading-tight">
                Capture small ideas. Build big momentum.
              </h1>
              <p className="mt-4 text-base-content/70">
                Nooklet is your minimalist, AI‑ready second brain: fast capture,
                gentle structure, and privacy‑first publishing when you’re
                ready.
              </p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <Link href="/register" className="btn btn-primary">
                  Get started — it’s free
                </Link>
                <a href="#features" className="btn btn-outline">
                  View all featuresss →
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="grid sm:grid-cols-3 gap-4 text-sm">
          <div className="card card-bordered bg-base-200">
            <div className="card-body">
              <div className="card-title text-base-content">Fast capture</div>
              <p className="opacity-80">
                Create a nooklet in seconds with a clean, focused editor.
              </p>
            </div>
          </div>
          <div className="card card-bordered bg-base-200">
            <div className="card-body">
              <div className="card-title text-base-content">
                Organized by design
              </div>
              <p className="opacity-80">
                Tags and timelines keep your ideas findable without friction.
              </p>
            </div>
          </div>
          <div className="card card-bordered bg-base-200">
            <div className="card-body">
              <div className="card-title text-base-content">Privacy‑first</div>
              <p className="opacity-80">
                Draft privately. Publish when ready. Always reversible.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="text-center text-xs opacity-60 py-6">
        © {new Date().getFullYear()} Nooklet
      </footer>
    </div>
  );
}
