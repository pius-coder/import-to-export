# API Documentation

This documentation organizes all API endpoints into three categories based on their execution context and data fetching strategy.

## Overview

### 🔄 [Hybrid Endpoints](./hybrid/README.md)

**HTTP GET Routes + Client Hook**

Used for data that needs both client-side interactivity and server-side initial loading.

- **Framework**: Next.js API Routes (`/api/hybrid/*`)
- **HTTP Method**: GET only
- **Page load**: Server fetches data
- **Real-time updates**: Client hook refetches data
- **Examples**: Products list, categories, user dashboard

**8 endpoints** covering listings and common data that users browse frequently.

---

### 💻 [Client-Only Endpoints](./client/README.md)

**Server Actions + React Query useMutation**

User interactions, form submissions, and state mutations. Called only from client with user events.

- **Framework**: Next.js Server Actions (`/app/actions/*`)
- **HTTP Method**: N/A (direct function calls)
- **Execution**: Server-side logic in server action
- **Client Integration**: useMutation hook with React Query
- **Examples**: Form submissions, button clicks, API calls

**15+ actions** for all user-triggered mutations without needing API routes.

---

### 🖥️ [Server-Only Endpoints](./server/README.md)

**Direct Service Calls**

Data fetching and operations that only happen on the server. No HTTP requests needed.

- **Framework**: Direct service imports
- **HTTP Method**: N/A (direct function calls)
- **Usage**: Server Components only
- **Examples**: Detail pages, admin operations

**25+ endpoints** for server-side logic and admin features.

---

## Quick Reference

### When to Use Each Type

| Type       | Use Case                         | Example                   | Implementation                                        |
| ---------- | -------------------------------- | ------------------------- | ----------------------------------------------------- |
| **Hybrid** | Initial page load + live updates | Products listing          | Server Component + useQuery hook from `/api/hybrid/*` |
| **Client** | User interactions & mutations    | Form submit, delete       | Server Action in `/app/actions/*` + useMutation hook  |
| **Server** | Detail views & admin operations  | Product detail, dashboard | Server Component + direct service import              |

---

## API Structure

```
/app
├── /actions
│   ├── auth.actions.ts (register, login, logout)
│   ├── reservations.actions.ts (create, delete)
│   ├── transport.actions.ts (calculate, create)
│   ├── devis.actions.ts (create)
│   ├── messages.actions.ts (send)
│   └── contact.actions.ts (submit)
├── /api
│   ├── /hybrid
│   │   ├── /produits/route.ts
│   │   ├── /categories/route.ts
│   │   ├── /reservations/route.ts
│   │   ├── /transport/route.ts
│   │   ├── /devis/route.ts
│   │   ├── /messages/route.ts
│   │   └── /profil/route.ts
│   └── /server (internal, not for client use)
```

---

## Implementation Patterns

### Hybrid Pattern (Server Component + Client Hook)

```typescript
// app/produits/page.tsx (Server Component)
import { productService } from '@/services';
import { ProductsClient } from '@/components/ProductsClient';

export default async function ProductsPage() {
  // Direct service call - no HTTP request on server
  const { data, pagination } = await productService.getAllProducts({
    page: 1,
    limit: 20
  });

  return <ProductsClient initialData={data} initialPagination={pagination} />;
}

// components/ProductsClient.tsx (Client Component)
'use client'

import { useProducts } from '@/lib/hooks/queries';

export function ProductsClient({ initialData, initialPagination }) {
  const [page, setPage] = useState(1);

  // useQuery with initialData from server
  const { data } = useProducts(page, {
    initialData: page === 1 ? initialData : undefined,
  });

  return <Display data={data} />;
}

// lib/hooks/queries.ts
export const useProducts = (page = 1) => {
  return useQuery({
    queryKey: ['products', page],
    queryFn: async () => {
      // Client only fetches via API for refetches/page changes
      const res = await fetch(`/api/hybrid/produits?page=${page}`);
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });
};
```

### Client Pattern (Server Actions + useMutation)

```typescript
// app/actions/auth.actions.ts
'use server'

import { authService } from '@/services';

export async function registerAction(data: RegisterInput) {
  try {
    const result = await authService.register(data);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// app/components/RegisterForm.tsx
'use client'

import { useMutation } from '@tanstack/react-query';
import { registerAction } from '@/actions/auth.actions';

export function RegisterForm() {
  const mutation = useMutation({
    mutationFn: registerAction,
    onSuccess: () => {
      // Redirect or show success
    },
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      mutation.mutate(Object.fromEntries(formData));
    }}>
      {/* form fields */}
    </form>
  );
}
```

### Server Pattern

```typescript
import { productService } from '@/services';

export default async function ProductDetail({ params }) {
  const product = await productService.getProductById(params.id);
  return <Display product={product} />;
}
```

---

## Authentication

### Token Management

- **Hybrid & Client**: Store token in httpOnly cookie or localStorage
- **Server**: Use middleware to refresh token
- **Admin**: Separate token with admin role

### Protected Routes

- Hybrid endpoints: Check token in middleware
- Client endpoints: Browser automatically sends token
- Server endpoints: Use server session

---

## Error Handling

All endpoints follow consistent error format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {}
  }
}
```

---

## Tags & Query Invalidation

Each endpoint has tags for query invalidation:

```typescript
// When user creates reservation
queryClient.invalidateQueries({ queryKey: ["reservations"] });

// Cascade invalidation
queryClient.invalidateQueries({ queryKey: ["user-data"] });
```

---

## Rate Limiting

- Public endpoints: 100 requests/minute per IP
- Authenticated endpoints: 500 requests/minute per user
- Admin endpoints: 1000 requests/minute per admin

---

## Pagination

Hybrid and server endpoints support pagination:

```typescript
GET /api/hybrid/products?page=1&limit=20
```

Response includes:

```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

---

## Caching Strategy

### Hybrid Endpoints

- Server: 30 minutes revalidation
- Client: 5 minutes staleTime

### Client Endpoints

- No caching (always fresh)
- Invalidate on success

### Server Endpoints

- No caching (server-side only)
- Real-time data

---

## Next Steps

1. Start with **Hybrid endpoints** for basic data fetching
2. Implement **Client endpoints** for form handling
3. Use **Server endpoints** for detail views and admin
4. Set up proper query invalidation patterns
5. Implement error handling and loading states
