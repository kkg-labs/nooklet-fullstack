import { Head, Link, usePage } from '@inertiajs/react';
import Navigation from '../components/layout/Navigation';
import type { SharedProps } from '@adonisjs/inertia/types';

export default function Landing() {
  const { user, flash } = usePage<SharedProps>().props as unknown as {
    user?: {
      id: string;
      email: string;
      profile?: {
        username?: string;
        displayName?: string;
      };
    } | null;
    flash?: { success?: string; errors?: Record<string, string> };
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <Head title="Nooklet — Capture small ideas. Build big momentum." />

      <Navigation user={user} />

      <main className="container mx-auto px-6 pt-12 pb-20 grid gap-10">
        {flash?.success && (
          <div className="alert alert-success max-w-md mx-auto">
            <span>{flash.success}</span>
          </div>
        )}
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
                  View all features →
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
