import Link from 'next/link';
import { redirect } from 'next/navigation';
import { loginAction } from '@/app/login/actions';
import { createSupabaseAuthServerClient } from '@/lib/supabase/auth-server';

export const dynamic = 'force-dynamic';

interface LoginPageProps {
  searchParams?: {
    next?: string;
    error?: string;
  };
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const supabase = createSupabaseAuthServerClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  const nextPath = searchParams?.next || '/admin';
  const error = searchParams?.error;

  if (user) {
    redirect(nextPath);
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <div className="mx-auto flex min-h-[80vh] max-w-md items-center">
        <section className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Talosity Secure Admin</p>
          <h1 className="mt-2 text-2xl font-semibold">Login</h1>
          <p className="mt-1 text-sm text-slate-600">Sign in with your Supabase account to access enterprise admin tools.</p>

          {error ? (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>
          ) : null}

          <form action={loginAction} className="mt-4 space-y-3">
            <input type="hidden" name="next" value={nextPath} />
            <input
              name="email"
              type="email"
              required
              placeholder="Email"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            />
            <input
              name="password"
              type="password"
              required
              placeholder="Password"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            />
            <button type="submit" className="w-full rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white">
              Sign In
            </button>
          </form>

          <p className="mt-4 text-xs text-slate-500">
            Return to <Link href="/" className="underline">Talosity.com</Link>
          </p>
        </section>
      </div>
    </main>
  );
}
