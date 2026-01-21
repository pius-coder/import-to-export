# Implementation Roadmap

This document outlines the complete implementation plan based on the verified API documentation.

## Phase 1: Hybrid Endpoints (GET API Routes)

### Files to Create

```
app/api/hybrid/
├── produits/route.ts
├── categories/route.ts
├── reservations/route.ts
├── transport/route.ts
├── devis/route.ts
├── messages/route.ts
├── profil/route.ts
└── accompagnement/
    └── formules/route.ts
```

### Key Requirements

- Use direct service calls (e.g., `productService.getAllProducts()`)
- Parse query parameters for filters and pagination
- Return `{ success: true, data, pagination }` structure
- Handle all errors with proper HTTP status codes

### Pattern Template

```typescript
// app/api/hybrid/[resource]/route.ts
import { [Resource]Service } from '@/services';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const result = await [resource]Service.getAll({
      // Parse params from searchParams
    });

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

---

## Phase 2: Client Mutations (Server Actions)

### Files to Create

```
app/actions/
├── auth.actions.ts
├── reservations.actions.ts
├── transport.actions.ts
├── devis.actions.ts
├── messages.actions.ts
├── contact.actions.ts
└── profile.actions.ts
```

### Key Requirements

- Mark all functions with `'use server'`
- Use direct service calls
- Handle authentication (cookies, tokens)
- Return `{ success: true/false, data?, error? }` structure
- Validate input before calling services

### Pattern Template

```typescript
// app/actions/[resource].actions.ts
'use server'

import { [Resource]Service } from '@/services';
import { cookies } from 'next/headers';

export async function create[Resource]Action(input: CreateInput) {
  try {
    const result = await [resource]Service.create(input);

    // If authentication needed, set cookie
    if (result.token) {
      cookies().set('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

---

## Phase 3: React Query Hooks

### Files to Create

```
lib/hooks/
├── queries.ts (for hybrid useQuery hooks)
└── mutations.ts (for client useMutation hooks)
```

### Key Requirements

- Wrap all API calls in hooks
- Set appropriate staleTime for caching
- Use consistent queryKey patterns
- Handle loading, error, success states

### Queries Pattern (Hybrid)

```typescript
export const useProducts = (page = 1, options = {}) => {
  return useQuery({
    queryKey: ["products", page],
    queryFn: async () => {
      const res = await fetch(`/api/hybrid/produits?page=${page}`);
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};
```

### Mutations Pattern (Client Actions)

```typescript
export const useRegisterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};
```

---

## Phase 4: Server Components

### Files to Create

```
app/
├── produits/
│   ├── page.tsx (listing - hybrid)
│   └── [id]/
│       └── page.tsx (detail - server)
├── reservations/
│   ├── page.tsx (listing - hybrid)
│   ├── [id]/
│   │   └── page.tsx (detail - server)
│   └── create/
│       └── page.tsx (form - client action)
├── transport/
│   ├── page.tsx (listing - hybrid)
│   └── [id]/
│       └── page.tsx (detail - server)
└── [other resources]/
```

### Pattern: Hybrid Listing Page

```typescript
// app/produits/page.tsx
import { productService } from '@/services';
import { ProductsList } from '@/components/ProductsList';

export default async function ProduitsPage() {
  const { data, pagination } = await productService.getAllProducts({
    page: 1,
    limit: 20,
  });

  return <ProductsList initialData={data} initialPagination={pagination} />;
}
```

### Pattern: Server Detail Page

```typescript
// app/produits/[id]/page.tsx
import { productService } from '@/services';

export default async function ProductPage({ params }) {
  const product = await productService.getProductById(params.id);
  return <ProductDetail product={product} />;
}
```

### Pattern: Client Component with Hook

```typescript
// components/ProductsList.tsx
'use client'

import { useState } from 'react';
import { useProducts } from '@/lib/hooks/queries';

export function ProductsList({ initialData, initialPagination }) {
  const [page, setPage] = useState(1);
  const { data } = useProducts(page, {
    initialData: page === 1 ? initialData : undefined,
  });

  return (
    <div>
      {data?.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

---

## Implementation Checklist

### Phase 1: Hybrid Endpoints

- [ ] Create `/app/api/hybrid/` directory structure
- [ ] Implement all 8 hybrid GET routes
- [ ] Test each endpoint with proper query parameters
- [ ] Verify pagination structure
- [ ] Test error handling

### Phase 2: Server Actions

- [ ] Create `/app/actions/` directory structure
- [ ] Implement all 15 mutation Server Actions
- [ ] Add authentication/cookie handling
- [ ] Test error scenarios
- [ ] Validate all inputs

### Phase 3: React Query Setup

- [ ] Create hook wrappers in `/lib/hooks/`
- [ ] Set appropriate cache times
- [ ] Test invalidation logic
- [ ] Test initialData behavior

### Phase 4: Pages & Components

- [ ] Create listing pages (hybrid pattern)
- [ ] Create detail pages (server pattern)
- [ ] Create client components with hooks
- [ ] Create forms with mutation hooks
- [ ] Test SSR and client hydration

---

## Testing Strategy

### Unit Tests

- Each service method
- Query parameter parsing in API routes
- Server Action input validation

### Integration Tests

- Full request/response cycles for each endpoint
- Server → Client initialData passing
- Cache invalidation triggers

### E2E Tests

- User registration flow
- Product listing and search
- Reservation creation
- Admin operations

---

## Performance Considerations

1. **Caching**
   - Hybrid endpoints: 5min stale time for products
   - Hybrid endpoints: 30min stale time for categories
   - Server endpoints: No caching (always fresh)

2. **API Route Optimization**
   - Parse only needed query parameters
   - Use pagination to limit data
   - Cache database queries in service layer

3. **Server Component Optimization**
   - Use streaming for large datasets
   - Cache service calls at appropriate levels
   - Prefetch related data when needed

---

## Documentation References

- **Architecture Details**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- **API Categorization**: [CATEGORIZATION.md](./CATEGORIZATION.md)
- **Quick Implementation**: [QUICKSTART.md](./QUICKSTART.md)
- **Verification**: [VERIFICATION.md](./VERIFICATION.md)
- **Full Index**: [INDEX.md](./INDEX.md)

---

## Notes

- All implementations must follow the verified patterns exactly
- No deviations from hybrid/client/server categorization
- No HTTP calls on server side (except API routes for hybrid)
- All mutations must use Server Actions
- Always use service layer for data access
