import { cookies } from 'next/headers';

export async function getUserIdFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return null;
  }

  // Parse stub token format: token_{userId}_{role}_{timestamp}
  const parts = token.split('_');
  if (parts.length >= 4 && parts[0] === 'token') {
    return parts[1];
  }

  // Fallback for development/testing if simple ID is passed as token
  if (process.env.NODE_ENV === 'development') {
    return token;
  }

  return null;
}
