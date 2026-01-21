import { NextRequest } from 'next/server';

/**
 * Extract user ID from the Authorization header.
 * Expected format: "Bearer token_{userId}_{role}_{timestamp}"
 */
export function getUserIdFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];

  // Parse stub token format: token_{userId}_{role}_{timestamp}
  const parts = token.split('_');
  if (parts.length >= 4 && parts[0] === 'token') {
    return parts[1];
  }

  // Fallback for development/testing if simple ID is passed as token
  // or if we want to support a "mock" mode where the token IS the userId
  if (process.env.NODE_ENV === 'development') {
      return token;
  }

  return null;
}

/**
 * Extract user role from the Authorization header.
 */
export function getUserRoleFromRequest(request: NextRequest): string | null {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.split(' ')[1];

    // Parse stub token format: token_{userId}_{role}_{timestamp}
    const parts = token.split('_');
    if (parts.length >= 4 && parts[0] === 'token') {
      return parts[2];
    }

    return null;
}
