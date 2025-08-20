import { Head, Link, useForm, usePage } from "@inertiajs/react";
import type { SharedProps } from "@adonisjs/inertia/types";

export default function Register() {
  const { flash } = usePage<SharedProps>().props as unknown as {
    flash?: { success?: string; errors?: Record<string, string> };
  };

  const { data, setData, post, processing, errors, reset } = useForm({
    email: "",
    password: "",
    password_confirmation: "",
    username: "",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post("/register", {
      onSuccess: () => {
        reset("password", "password_confirmation");
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Head title="Register" />
      <form onSubmit={submit} className="w-full max-w-md card bg-base-200 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-2xl">Create your account</h1>

          {flash?.success && (
            <div className="alert alert-success">
              <span>{flash.success}</span>
            </div>
          )}

          <div className="form-control">
            <label htmlFor="email" className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              id="email"
              className="input input-bordered border-base-300 bg-base-100 [--input-border:var(--color-base-300)]"
              value={data.email}
              onChange={(e) => setData("email", e.target.value)}
              required
            />
            {(errors.email || (flash?.errors as Record<string, string> | undefined)?.email) && (
              <p className="text-error text-sm mt-1 text-[var(--color-red-500)]">
                {errors.email || (flash?.errors as Record<string, string> | undefined)?.email}
              </p>
            )}
          </div>

          <div className="form-control mt-2">
            <label htmlFor="password" className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              id="password"
              className="input input-bordered border-base-300 bg-base-100 [--input-border:var(--color-base-300)]"
              value={data.password}
              onChange={(e) => setData("password", e.target.value)}
              required
            />
            {errors.password && <p className="text-error text-sm mt-1 text-[var(--color-red-500)]">{errors.password}</p>}
          </div>

          <div className="form-control mt-2">
            <label htmlFor="password_confirmation" className="label">
              <span className="label-text">Confirm Password</span>
            </label>
            <input
              type="password"
              id="password_confirmation"
              className="input input-bordered border-base-300 bg-base-100 [--input-border:var(--color-base-300)]"
              value={data.password_confirmation}
              onChange={(e) => setData("password_confirmation", e.target.value)}
              required
            />
            {errors.password_confirmation && (
              <p className="text-error text-sm mt-1 text-[var(--color-red-500)]">{errors.password_confirmation}</p>
            )}
          </div>

          <div className="form-control mt-2">
            <label htmlFor="username" className="label">
              <span className="label-text">Username (optional)</span>
            </label>
            <input
              type="text"
              id="username"
              className="input input-bordered border-base-300 bg-base-100 [--input-border:var(--color-base-300)]"
              value={data.username}
              onChange={(e) => setData("username", e.target.value)}
            />
            {errors.username && <p className="text-error text-sm mt-1 text-[var(--color-red-500)]">{errors.username}</p>}
          </div>

          <div className="form-control mt-4">
            <button
              type="submit"
              disabled={processing}
              className="btn btn-primary w-full"
            >
              {processing ? "Creating account..." : "Register"}
            </button>
          </div>

          <p className="mt-3 text-sm text-base-content/70">
            Already have an account?{" "}
            <Link href="/login" className="link link-primary">
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
