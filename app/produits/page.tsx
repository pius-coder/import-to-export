import { ProductService, getPrismaClient } from '@/services';
import { ProductsList } from '@/components/ProductsList';

export default async function ProduitsPage() {
  const prisma = getPrismaClient();
  const productService = new ProductService(prisma);
  const { products } = await productService.getAllProducts({
    page: 1,
    limit: 20,
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Nos Produits</h1>
      <ProductsList initialData={products} />
    </div>
  );
}
