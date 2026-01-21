'use server';

import { TransportService, getPrismaClient } from '@/services';
import { getUserIdFromCookie } from './utils';

export async function calculateTransportCostAction(data: {
  pays_depart: string;
  pays_destination: string;
  type_marchandise: string;
  poids: number;
  volume: number;
}) {
  const prisma = getPrismaClient();
  const transportService = new TransportService(prisma);

  try {
    const result = await transportService.calculateTransportCost(data);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createTransportAction(data: {
  pays_depart: string;
  pays_destination: string;
  type_marchandise: string;
  poids: number;
  volume: number;
  mode_transport: 'maritime' | 'aerien';
  description?: string;
}) {
  const userId = await getUserIdFromCookie();
  if (!userId) {
    return { success: false, error: 'Unauthorized' };
  }

  const prisma = getPrismaClient();
  const transportService = new TransportService(prisma);

  try {
    const result = await transportService.createTransport({
      user_id: userId,
      pays_depart: data.pays_depart,
      pays_destination: data.pays_destination,
      type_marchandise: data.type_marchandise,
      poids: data.poids,
      volume: data.volume,
      mode_transport: data.mode_transport,
      description: data.description,
    });
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
