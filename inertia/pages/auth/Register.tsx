import { Head, Link, useForm, usePage } from "@inertiajs/react";
import type { SharedProps } from "@adonisjs/inertia/types";
import LabeledTextInput from "../../components/form/LabeledTextInput";

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
            error={errors.password || null}
            containerClassName="mt-2"
          />

          <LabeledTextInput
            id="password_confirmation"
            type="password"
            label="Confirm Password"
            value={data.password_confirmation}
            onChange={(e) => setData("password_confirmation", (e.target as HTMLInputElement).value)}
            required
            error={errors.password_confirmation || null}
            containerClassName="mt-2"
          />

          <LabeledTextInput
            id="username"
            type="text"
            label="Username (optional)"
            value={data.username}
            onChange={(e) => setData("username", (e.target as HTMLInputElement).value)}
            error={errors.username || (flash?.errors as Record<string, string> | undefined)?.username || null}
            containerClassName="mt-2"
          />

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
