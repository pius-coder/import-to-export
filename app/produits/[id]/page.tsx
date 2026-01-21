import { ProductService, getPrismaClient } from '@/services';
import { notFound } from 'next/navigation';

// Next.js 15 params is async
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const prisma = getPrismaClient();
  const productService = new ProductService(prisma);
  const product = await productService.getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{product.nom}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
           <div className="bg-gray-200 h-64 w-full rounded flex items-center justify-center text-gray-500">
             Image du produit
           </div>
        </div>
        <div>
          <p className="text-2xl font-semibold mb-4 text-blue-600">{product.prix.toString()} {product.devise}</p>
          <div className="prose max-w-none mb-6">
            <p>{product.description}</p>
          </div>

          <div className="border-t pt-4 space-y-2 text-sm text-gray-600">
            <h3 className="font-bold text-gray-900 mb-2">Détails techniques</h3>
            <p><span className="font-semibold">Pays d'origine:</span> {product.pays_origine}</p>
            <p><span className="font-semibold">Quantité minimum:</span> {product.quantite_minimum}</p>
            <p><span className="font-semibold">Délai de livraison:</span> {product.delai_livraison}</p>
            {product.poids && <p><span className="font-semibold">Poids:</span> {product.poids.toString()} kg</p>}
            {product.dimensions && <p><span className="font-semibold">Dimensions:</span> {product.dimensions}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
