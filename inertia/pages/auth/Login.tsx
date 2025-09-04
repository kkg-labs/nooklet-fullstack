import { Head, Link, useForm, usePage } from "@inertiajs/react";
import type { SharedProps } from "@adonisjs/inertia/types";
import LabeledTextInput from "../../components/form/LabeledTextInput";

export default function Login() {
  const { flash } = usePage<SharedProps>().props as unknown as {
    flash?: { success?: string; errors?: Record<string, string> };
  };

  const { data, setData, post, processing, errors, reset } = useForm({
    email: "",
    password: "",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post("/login", {
      onSuccess: () => {
        reset("password");
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Head title="Login" />
      <form onSubmit={submit} className="w-full max-w-md card bg-base-200 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-2xl">Sign in to your account</h1>

          {flash?.success && (
            <div className="alert alert-success">
              <span>{flash.success}</span>
            </div>
          )}

          {flash?.errors && typeof flash.errors === 'object' && Object.keys(flash.errors).length > 0 && (
            <div className="alert alert-error">
              <span>Please check the errors below</span>
            </div>
          )}

          <LabeledTextInput
            id="email"
            type="email"
            label="Email"
            value={data.email}
            onChange={(e) => setData("email", (e.target as HTMLInputElement).value)}
            required
            error={errors.email || (flash?.errors as Record<string, string> | undefined)?.email || null}
          />

          <LabeledTextInput
            id="password"
            type="password"
            label="Password"
            value={data.password}
            onChange={(e) => setData("password", (e.target as HTMLInputElement).value)}
            required
            error={errors.password || (flash?.errors as Record<string, string> | undefined)?.password || null}
            containerClassName="mt-2"
          />

          <div className="form-control mt-4">
            <button
              type="submit"
              disabled={processing}
              className="btn btn-primary w-full"
            >
              {processing ? "Signing in..." : "Sign in"}
            </button>
          </div>

          <p className="mt-3 text-sm text-base-content/70">
            Don't have an account?{" "}
            <Link href="/register" className="link link-primary">
              Register
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
