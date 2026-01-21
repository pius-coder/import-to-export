import { ReservationService, getPrismaClient } from '@/services';
import { getUserIdFromCookie } from '@/app/actions/utils';
import { notFound, redirect } from 'next/navigation';

export default async function ReservationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await getUserIdFromCookie();

  if (!userId) {
    redirect('/login');
  }

  const prisma = getPrismaClient();
  const reservationService = new ReservationService(prisma);
  const reservation = await reservationService.getReservationById(id);

  if (!reservation) {
    notFound();
  }

  if (reservation.user_id !== userId) {
      return <div className="p-4 text-red-500">Vous n'êtes pas autorisé à voir cette réservation.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
          <a href="/reservations" className="text-blue-500 hover:underline">&larr; Retour aux réservations</a>
      </div>
      <h1 className="text-2xl font-bold mb-4">Réservation {reservation.numero_reservation}</h1>
      <div className="bg-white p-6 rounded shadow border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h3 className="font-bold text-gray-700 uppercase text-sm">Statut</h3>
                <p className="mb-4">{reservation.statut}</p>

                <h3 className="font-bold text-gray-700 uppercase text-sm">Produit</h3>
                <p className="mb-4">{reservation.produits?.nom}</p>

                <h3 className="font-bold text-gray-700 uppercase text-sm">Quantité</h3>
                <p className="mb-4">{reservation.quantite}</p>
            </div>
            <div>
                <h3 className="font-bold text-gray-700 uppercase text-sm">Prix Total</h3>
                <p className="mb-4 text-xl font-semibold text-blue-600">{reservation.prix_total.toString()} USD</p>

                <h3 className="font-bold text-gray-700 uppercase text-sm">Notes</h3>
                <p className="mb-4 italic text-gray-600">{reservation.notes || 'Aucune note'}</p>

                <h3 className="font-bold text-gray-700 uppercase text-sm">Date de création</h3>
                <p className="text-gray-600">{new Date(reservation.created_at).toLocaleDateString()}</p>
            </div>
        </div>
      </div>
    </div>
  );
}
