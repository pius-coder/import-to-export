import { TransportService, getPrismaClient } from '@/services';
import { getUserIdFromCookie } from '@/app/actions/utils';
import { notFound, redirect } from 'next/navigation';

export default async function TransportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await getUserIdFromCookie();

  if (!userId) {
    redirect('/login');
  }

  const prisma = getPrismaClient();
  const transportService = new TransportService(prisma);
  const transport = await transportService.getTransportById(id);

  if (!transport) {
    notFound();
  }

  if (transport.user_id !== userId) {
      return <div className="p-4 text-red-500">Vous n'êtes pas autorisé à voir ce transport.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
          <a href="/transport" className="text-blue-500 hover:underline">&larr; Retour aux transports</a>
      </div>
      <h1 className="text-2xl font-bold mb-4">Transport {transport.numero_transport}</h1>
      <div className="bg-white p-6 rounded shadow border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h3 className="font-bold text-gray-700 uppercase text-sm">Statut</h3>
                <p className="mb-4">{transport.statut}</p>

                <h3 className="font-bold text-gray-700 uppercase text-sm">Départ</h3>
                <p className="mb-4">{transport.pays_depart}</p>

                <h3 className="font-bold text-gray-700 uppercase text-sm">Destination</h3>
                <p className="mb-4">{transport.pays_destination}</p>
            </div>
            <div>
                <h3 className="font-bold text-gray-700 uppercase text-sm">Mode</h3>
                <p className="mb-4">{transport.mode_transport}</p>

                <h3 className="font-bold text-gray-700 uppercase text-sm">Type Marchandise</h3>
                <p className="mb-4">{transport.type_marchandise}</p>

                <h3 className="font-bold text-gray-700 uppercase text-sm">Poids/Volume</h3>
                <p className="mb-4">{transport.poids.toString()} kg / {transport.volume.toString()} m³</p>
            </div>
        </div>
        {transport.transport_timeline && transport.transport_timeline.length > 0 && (
            <div className="mt-8 pt-6 border-t">
                <h3 className="font-bold text-lg mb-4">Suivi</h3>
                <div className="space-y-4">
                    {transport.transport_timeline.map((event: any) => (
                        <div key={event.id} className="flex gap-4">
                            <div className="w-4 h-4 rounded-full bg-blue-500 mt-1"></div>
                            <div>
                                <p className="font-semibold">{event.etape}</p>
                                <p className="text-gray-600">{event.description}</p>
                                <p className="text-xs text-gray-500">{new Date(event.created_at).toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
