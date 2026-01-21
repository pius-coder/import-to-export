'use client';

import { useState } from 'react';
import { useTransports } from '@/lib/hooks/queries';

export function TransportsList({ initialData }: { initialData: any[] }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useTransports(page, {
    initialData: page === 1 ? initialData : undefined,
  });

  const transports = data?.data || data || [];

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div className="space-y-4">
      {transports.length === 0 ? (
        <p className="text-gray-500">Aucun transport trouvé.</p>
      ) : (
        transports.map((t: any) => (
          <div key={t.id} className="border p-4 rounded shadow bg-white">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-bold text-lg">{t.numero_transport}</h2>
              <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs uppercase font-semibold">
                {t.statut}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <p><span className="font-semibold">De:</span> {t.pays_depart}</p>
                <p><span className="font-semibold">Vers:</span> {t.pays_destination}</p>
              </div>
              <div>
                <p><span className="font-semibold">Mode:</span> {t.mode_transport}</p>
                <p><span className="font-semibold">Type:</span> {t.type_marchandise}</p>
              </div>
            </div>
            <a href={`/transport/${t.id}`} className="text-blue-500 hover:underline mt-4 block text-sm">
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
