'use server';

import { redirect } from 'next/navigation';
import { createSupabaseAuthServerClient } from '@/lib/supabase/auth-server';

export async function loginAction(formData: FormData) {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  const nextPath = String(formData.get('next') ?? '/admin');

  const supabase = await createSupabaseAuthServerClient();
  if (!supabase) {
    redirect(`/login?error=${encodeURIComponent('Supabase authentication is not configured.')}&next=${encodeURIComponent(nextPath)}`);
  }
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}&next=${encodeURIComponent(nextPath)}`);
  }

  redirect(nextPath || '/admin');
}

export async function logoutAction() {
  const supabase = await createSupabaseAuthServerClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  redirect('/login');
}
