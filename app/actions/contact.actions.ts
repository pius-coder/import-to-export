'use server';

import { ContactService, getPrismaClient } from '@/services';
import { headers } from 'next/headers';

export async function submitContactAction(data: {
  nom: string;
  email: string;
  telephone?: string;
  sujet: string;
  message: string;
}) {
  const prisma = getPrismaClient();
  const contactService = new ContactService(prisma);
  const ip_address = (await headers()).get('x-forwarded-for') || undefined;

  try {
    const result = await contactService.submitContact({
      ...data,
      ip_address: Array.isArray(ip_address) ? ip_address[0] : ip_address,
    });
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
