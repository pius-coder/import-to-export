'use client';

import { useState } from 'react';
import { useCreateReservationMutation } from '@/lib/hooks/mutations';
import { useProducts } from '@/lib/hooks/queries';
import { useRouter } from 'next/navigation';

export function ReservationForm() {
  const router = useRouter();
  const { mutate, isPending } = useCreateReservationMutation();
  const { data: productsData } = useProducts(1, { limit: 100 });
  const products = productsData?.data || [];

  const [formData, setFormData] = useState({
    produit_id: '',
    quantite: 1,
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find((p: any) => p.id === formData.produit_id);
    if (!product) return;

    mutate(
      {
        produit_id: formData.produit_id,
        quantite: Number(formData.quantite),
        prix_unitaire: product.prix,
        notes: formData.notes,
      },
      {
        onSuccess: () => {
          router.push('/reservations');
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-lg mx-auto p-6 border rounded shadow bg-white"
    >
      <h2 className="text-xl font-bold mb-4">Nouvelle Réservation</h2>
      <div>
        <label className="block mb-1 font-semibold">Produit</label>
        <select
          className="w-full border p-2 rounded"
          value={formData.produit_id}
          onChange={(e) => setFormData({ ...formData, produit_id: e.target.value })}
          required
        >
          <option value="">Sélectionner un produit</option>
          {products.map((p: any) => (
            <option key={p.id} value={p.id}>
              {p.nom} - {p.prix} {p.devise}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-1 font-semibold">Quantité</label>
        <input
          type="number"
          min="1"
          className="w-full border p-2 rounded"
          value={formData.quantite}
          onChange={(e) =>
            setFormData({ ...formData, quantite: parseInt(e.target.value) })
          }
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-semibold">Notes</label>
        <textarea
          className="w-full border p-2 rounded h-24"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={isPending}
      >
        {isPending ? 'Création en cours...' : 'Créer la réservation'}
      </button>
    </form>
  );
}
