import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function requireUserId(): Promise<string | null> {
  const session = await getSession();
  return session?.user?.id ?? null;
}
