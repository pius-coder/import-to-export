import { TransportService, getPrismaClient } from '@/services';
import { getUserIdFromCookie } from '@/app/actions/utils';
import { TransportsList } from '@/components/TransportsList';
import { redirect } from 'next/navigation';

export default async function TransportsPage() {
  const userId = await getUserIdFromCookie();
  if (!userId) {
    redirect('/login?callbackUrl=/transport');
  }

  const prisma = getPrismaClient();
  const transportService = new TransportService(prisma);
  const { transports } = await transportService.getUserTransports(userId, 0, 20);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mes Transports</h1>
        {/* Add button to create transport if needed */}
      </div>
      <TransportsList initialData={transports} />
    </div>
  );
}
