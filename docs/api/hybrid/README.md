# Hybrid API Endpoints

These endpoints are used for **data initialization** on page load with both server-side and client-side updates.

## Implementation Pattern

**Server Component (Initial Load)**

```typescript
// app/produits/page.tsx
import { productService } from '@/services';
import { ProductsClient } from '@/components/ProductsClient';

export default async function ProductsPage() {
  // Direct service call - no HTTP request
  const { data, pagination } = await productService.getAllProducts({
    page: 1,
    limit: 20
  });

  return <ProductsClient initialData={data} initialPagination={pagination} />;
}
```

**Client Component (Real-time Updates)**

```typescript
// components/ProductsClient.tsx
'use client'

import { useProducts } from '@/lib/hooks/queries';

export function ProductsClient({ initialData, initialPagination }) {
  const [page, setPage] = useState(1);

  // useQuery hook with initialData from server
  const { data } = useProducts(page, {
    initialData: page === 1 ? initialData : undefined,
  });

  return <Display data={data} pagination={initialPagination} />;
}
```

**Query Hook (Client-side)**

```typescript
// lib/hooks/queries.ts
export const useProducts = (page = 1) => {
  return useQuery({
    queryKey: ["products", page],
    queryFn: async () => {
      // Client calls hybrid API route for refetches
      const res = await fetch(`/api/hybrid/produits?page=${page}`);
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

## Endpoints

- [GET /produits](./products.md)
- [GET /categories](./categories.md)
- [GET /reservations](./reservations.md)
- [GET /transport](./transport.md)
- [GET /devis](./devis.md)
- [GET /profil](./profile.md)
- [GET /messages](./messages.md)
- [GET /accompagnement/formules](./accompagnement.md)
