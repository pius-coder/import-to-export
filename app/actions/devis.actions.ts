'use server';

import { DevisService, getPrismaClient } from '@/services';
import { getUserIdFromCookie } from './utils';

export async function createDevisAction(data: {
  type_service: 'achat' | 'transport' | 'accompagnement';
  nom: string;
  email: string;
  telephone: string;
  pays: string;
  details: string;
}) {
  const userId = await getUserIdFromCookie();

  const prisma = getPrismaClient();
  const devisService = new DevisService(prisma);

  try {
    const result = await devisService.createDevis({
      ...data,
      user_id: userId || undefined,
    });
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
