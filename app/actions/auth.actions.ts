'use server';

import { AuthService, getPrismaClient } from '@/services';
import { cookies } from 'next/headers';

export async function registerAction(data: {
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  pays?: string;
  mot_de_passe: string;
}) {
  const prisma = getPrismaClient();
  const authService = new AuthService(prisma);

  try {
    const result = await authService.register(data);

    if (result.success && result.token) {
      (await cookies()).set('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    return result;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function loginAction(data: {
  email: string;
  mot_de_passe: string;
}) {
  const prisma = getPrismaClient();
  const authService = new AuthService(prisma);

  try {
    const result = await authService.login(data);

    if (result.success && result.token) {
      (await cookies()).set('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    return result;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function logoutAction() {
  (await cookies()).delete('token');
  return { success: true };
}

export async function forgotPasswordAction(email: string) {
  const prisma = getPrismaClient();
  const authService = new AuthService(prisma);

  try {
    const result = await authService.forgotPassword(email);
    return result;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function resetPasswordAction(data: {
  token: string;
  nouveau_mot_de_passe: string;
}) {
  const prisma = getPrismaClient();
  const authService = new AuthService(prisma);

  try {
    const result = await authService.resetPassword(data);
    return result;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
