'use server';

import { ProfileService, getPrismaClient } from '@/services';
import { getUserIdFromCookie } from './utils';

export async function updateProfileAction(data: {
  nom?: string;
  prenom?: string;
  telephone?: string;
  pays?: string;
  adresse?: string;
}) {
  const userId = await getUserIdFromCookie();
  if (!userId) {
    return { success: false, error: 'Unauthorized' };
  }

  const prisma = getPrismaClient();
  const profileService = new ProfileService(prisma);

  try {
    const result = await profileService.updateProfile(userId, data);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
