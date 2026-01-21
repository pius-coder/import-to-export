'use server';

import { ReservationService, getPrismaClient } from '@/services';
import { getUserIdFromCookie } from './utils';

export async function createReservationAction(data: {
  produit_id: string;
  quantite: number;
  prix_unitaire: number;
  notes?: string;
}) {
  const userId = await getUserIdFromCookie();
  if (!userId) {
    return { success: false, error: 'Unauthorized' };
  }

  const prisma = getPrismaClient();
  const reservationService = new ReservationService(prisma);

  try {
    const result = await reservationService.createReservation({
      user_id: userId,
      produit_id: data.produit_id,
      quantite: data.quantite,
      prix_unitaire: data.prix_unitaire,
      notes: data.notes,
    });
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function cancelReservationAction(id: string) {
  const userId = await getUserIdFromCookie();
  if (!userId) {
    return { success: false, error: 'Unauthorized' };
  }

  const prisma = getPrismaClient();
  const reservationService = new ReservationService(prisma);

  try {
    // Verify ownership
    const reservation = await reservationService.getReservationById(id);
    if (!reservation) {
      return { success: false, error: 'Reservation not found' };
    }

    if (reservation.user_id !== userId) {
      return { success: false, error: 'Unauthorized' };
    }

    const result = await reservationService.cancelReservation(id);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
