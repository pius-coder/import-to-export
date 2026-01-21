'use client';

import { useState } from 'react';
import { useProducts } from '@/lib/hooks/queries';

export function ProductsList({ initialData }: { initialData: any[] }) {
  const [page, setPage] = useState(1);
  const { data } = useProducts(page, {
    initialData: page === 1 ? initialData : undefined,
  });

  const products = data?.data || data || []; // Handle API response structure wrapper or direct array

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.isArray(products) && products.map((product: any) => (
          <div key={product.id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-bold">{product.nom}</h2>
            <p className="text-gray-600">{product.description_courte}</p>
            <p className="font-semibold mt-2">{product.prix} {product.devise}</p>
            <a href={`/produits/${product.id}`} className="text-blue-500 hover:underline mt-2 block">
              Voir détails
            </a>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-4">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Précédent
        </button>
        <span className="px-4 py-2">Page {page}</span>
        <button
          onClick={() => setPage(p => p + 1)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
