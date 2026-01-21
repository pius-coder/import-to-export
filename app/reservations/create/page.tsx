import { ReservationForm } from '@/components/ReservationForm';
import { getUserIdFromCookie } from '@/app/actions/utils';
import { redirect } from 'next/navigation';

export default async function CreateReservationPage() {
  const userId = await getUserIdFromCookie();
  if (!userId) {
    redirect('/login?callbackUrl=/reservations/create');
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <a href="/reservations" className="text-blue-500 hover:underline">
          &larr; Retour aux réservations
        </a>
      </div>
      <ReservationForm />
    </div>
  );
}
