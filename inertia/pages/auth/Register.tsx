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
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-[var(--color-gray-800)] rounded-xl p-6 shadow border border-[var(--color-gray-700)]"
      >
        <h1 className="text-2xl font-semibold mb-4">Create your account</h1>

        {flash?.success && (
          <div className="mb-4 text-[var(--color-green-500)]">
            {flash.success}
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label
              htmlFor="email"
              className="block text-sm text-[var(--color-slate-300)] mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full input input-bordered bg-base-200"
              value={data.email}
              onChange={(e) => setData("email", e.target.value)}
              required
            />
            {(errors.email ||
              (flash?.errors as Record<string, string> | undefined)?.email) && (
              <p className="text-[var(--color-red-500)] text-sm mt-1">
                {errors.email ||
                  (flash?.errors as Record<string, string> | undefined)?.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm text-[var(--color-slate-300)] mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full input input-bordered bg-base-200"
              value={data.password}
              onChange={(e) => setData("password", e.target.value)}
              required
            />
            {errors.password && (
              <p className="text-[var(--color-red-500)] text-sm mt-1">
                {errors.password}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password_confirmation"
              className="block text-sm text-[var(--color-slate-300)] mb-1"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="password_confirmation"
              className="w-full input input-bordered bg-base-200"
              value={data.password_confirmation}
              onChange={(e) => setData("password_confirmation", e.target.value)}
              required
            />
            {errors.password_confirmation && (
              <p className="text-[var(--color-red-500)] text-sm mt-1">
                {errors.password_confirmation}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="username"
              className="block text-sm text-[var(--color-slate-300)] mb-1"
            >
              Username (optional)
            </label>
            <input
              type="text"
              id="username"
              className="w-full input input-bordered bg-base-200"
              value={data.username}
              onChange={(e) => setData("username", e.target.value)}
            />
            {errors.username && (
              <p className="text-[var(--color-red-500)] text-sm mt-1">
                {errors.username}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={processing}
          className="mt-5 w-full py-2 rounded bg-[var(--color-blue-400)] text-[var(--color-navy-900)] font-semibold disabled:opacity-60"
        >
          {processing ? "Creating account..." : "Register"}
        </button>

        <p className="mt-3 text-sm text-[var(--color-slate-300)]">
          Already have an account?{" "}
          <Link href="/login" className="text-[var(--color-blue-300)]">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
