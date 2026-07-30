import 'server-only';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export interface ServerAdminEnv {
  supabaseUrl: string;
  serviceRoleKey: string;
  openAiApiKey: string;
}

function getRequiredEnv(name: 'NEXT_PUBLIC_SUPABASE_URL' | 'SUPABASE_SERVICE_ROLE_KEY' | 'OPENAI_API_KEY'): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required for server-side SEO administration.`);
  }

  return value;
}

export function getServerAdminEnv(): ServerAdminEnv {
  return {
    supabaseUrl: getRequiredEnv('NEXT_PUBLIC_SUPABASE_URL'),
    serviceRoleKey: getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY'),
    openAiApiKey: getRequiredEnv('OPENAI_API_KEY'),
  };
}

export function getSupabaseServerAdminClient(): SupabaseClient {
  const { supabaseUrl, serviceRoleKey } = getServerAdminEnv();

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}