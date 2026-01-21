import { ReservationService, getPrismaClient } from '@/services';
import { getUserIdFromCookie } from '@/app/actions/utils';
import { ReservationsList } from '@/components/ReservationsList';
import { redirect } from 'next/navigation';

export default async function ReservationsPage() {
  const userId = await getUserIdFromCookie();

  if (!userId) {
     // Assuming /login exists
     redirect('/login?callbackUrl=/reservations');
  }

  const prisma = getPrismaClient();
  const reservationService = new ReservationService(prisma);
  const { reservations } = await reservationService.getUserReservations(userId, 0, 20);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mes Réservations</h1>
        <a href="/reservations/create" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Nouvelle Réservation
        </a>
      </div>
      <ReservationsList initialData={reservations} />
    </div>
  );
}
