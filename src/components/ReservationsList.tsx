'use client';

import { useState } from 'react';
import { useReservations } from '@/lib/hooks/queries';

export function ReservationsList({ initialData }: { initialData: any[] }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useReservations(page, {
    initialData: page === 1 ? initialData : undefined,
  });

  const reservations = data?.data || data || [];

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div className="space-y-4">
      {reservations.length === 0 ? (
        <p className="text-gray-500">Aucune réservation trouvée.</p>
      ) : (
        reservations.map((res: any) => (
          <div key={res.id} className="border p-4 rounded shadow bg-white">
            <div className="flex justify-between items-start mb-2">
              <h2 className="font-bold text-lg">{res.numero_reservation}</h2>
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  res.statut === 'confirmee'
                    ? 'bg-green-100 text-green-800'
                    : res.statut === 'annulee'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {res.statut.toUpperCase()}
              </span>
            </div>
            <p className="text-gray-700">Produit: <span className="font-medium">{res.produits?.nom || 'Produit inconnu'}</span></p>
            <div className="flex gap-4 mt-2 text-sm text-gray-600">
                <p>Quantité: {res.quantite}</p>
                <p>Total: {res.prix_total} USD</p>
            </div>
            <a href={`/reservations/${res.id}`} className="text-blue-500 hover:underline mt-4 block text-sm">
              Voir détails &rarr;
            </a>
          </div>
        ))
      )}

      <div className="flex justify-center gap-2 mt-6">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 text-sm"
        >
          Précédent
        </button>
        <span className="px-4 py-2 text-sm">Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-gray-200 rounded text-sm"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
