import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";

import type { SharedProps } from "@adonisjs/inertia/types";
import LabeledTextInput from "../../components/form/LabeledTextInput";

export default function Register() {
  const { flash } = usePage<SharedProps>().props as unknown as {
    flash?: { success?: string; errors?: Record<string, string> };
  };

  const initialStep = flash?.success
    ? 3
    : ((flash?.errors as Record<string, string> | undefined)?.username ||
      (flash?.errors as Record<string, string> | undefined)?.displayName)
      ? 2
      : 1;
  const [step, setStep] = useState<number>(initialStep);

  const { data, setData, post, processing, errors, reset } = useForm({
    email: "",
    password: "",
    password_confirmation: "",
    username: "",
    displayName: "",
  });
  useEffect(() => {
    if (!flash) return;
    const errs = (flash.errors as Record<string, string> | undefined) || {};
    if (flash.success) {
      setStep(3);
      return;
    }
    if (errs.username || errs.displayName) {
      setStep(2);
    } else if (errs.email || errs.password || errs.password_confirmation) {
      setStep(1);
    }
  }, [flash]);


  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post("/register", {
      preserveState: true, preserveScroll: true,
      onSuccess: () => {
        reset("password", "password_confirmation");
        setStep(3);
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Head title="Register" />
      <form onSubmit={submit} className="w-full max-w-md card bg-base-200 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-2xl">Create your account</h1>

          {/* Step progress */}
          <ul className="steps w-full mt-2">
            <li className={`step ${step >= 1 ? 'step-primary' : ''}`}>Credentials</li>
            <li className={`step ${step >= 2 ? 'step-primary' : ''}`}>Profile</li>
            <li className={`step ${step >= 3 ? 'step-primary' : ''}`}>Done</li>
          </ul>

          {flash?.success && step === 3 && (
            <div className="alert alert-success mt-3">
              <span>{flash.success}</span>
            </div>
          )}

          {/* Step 1: Credentials */}
          {step === 1 && (
            <>
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

              <div className="form-control mt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="btn btn-primary w-full"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {/* Step 2: Profile */}
          {step === 2 && (
            <>
              <LabeledTextInput
                id="username"
                type="text"
                label="Username (optional)"
                value={data.username}
                onChange={(e) => setData("username", (e.target as HTMLInputElement).value)}
                error={errors.username || (flash?.errors as Record<string, string> | undefined)?.username || null}
              />

              <LabeledTextInput
                id="displayName"
                type="text"
                label="Display Name (optional)"
                value={data.displayName}
                onChange={(e) => setData("displayName", (e.target as HTMLInputElement).value)}
                error={(flash?.errors as Record<string, string> | undefined)?.displayName || null}
                containerClassName="mt-2"
              />

              <div className="flex gap-2 mt-4">
                <button type="button" className="btn flex-1" onClick={() => setStep(1)}>
                  Back
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="btn btn-primary flex-1"
                >
                  {processing ? "Creating account..." : "Create account"}
                </button>
              </div>
            </>
          )}

          {/* Step 3: Done */}
          {step === 3 && (
            <div className="mt-4">
              <p className="text-base-content/80">Your account has been created.</p>
              <div className="form-control mt-4">
                <Link href="/login" className="btn btn-primary w-full">Continue to Login</Link>
              </div>
            </div>
          )}

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
