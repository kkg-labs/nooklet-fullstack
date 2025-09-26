import { Link, useForm, usePage } from '@inertiajs/react';
import type { SharedProps } from '@adonisjs/inertia/types';

interface User {
  id: string;
  email: string;
  profile?: {
    username?: string;
    displayName?: string;
  };
}

interface NavigationProps {
  user?: User | null;
}

export default function Navigation({ user }: NavigationProps) {
  const { post, processing } = useForm();

  const handleLogout = (e: React.FormEvent) => {
    e.preventDefault();
    post('/logout');
  };

  return (
    <header className="navbar bg-base-100 border-b border-base-300">
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost normal-case text-xl">
            Nooklet
          </Link>
        </div>
        <nav className="flex items-center gap-2">
          {user ? (
            // Authenticated user navigation
            <>
              <Link href="/dashboard" className="btn btn-ghost btn-sm">
                Dashboard
              </Link>
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-sm"
                >
                  {user.profile?.displayName ||
                    user.profile?.username ||
                    user.email}
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                >
                  <li>
                    <Link href="/profile">Profile</Link>
                  </li>
                  <li>
                    <Link href="/settings">Settings</Link>
                  </li>
                  <li>
                    <form onSubmit={handleLogout}>
                      <button
                        type="submit"
                        disabled={processing}
                        className="w-full text-left"
                      >
                        {processing ? 'Logging out...' : 'Logout'}
                      </button>
                    </form>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            // Guest navigation
            <>
              <Link href="/rag-test" className="btn btn-ghost btn-sm">
                RAG Test
              </Link>
              <Link href="/login" className="btn btn-ghost btn-sm">
                Log in
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm">
                Get started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
