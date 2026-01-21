# Architecture: Server Actions vs API Routes

## Key Distinction

### ❌ Client Endpoints DO NOT use `/api` routes

Instead, **Client Endpoints use Server Actions** with React Query mutations.

---

## Architecture Overview

```
Next.js App Structure
├── /app
│   ├── /actions (Server Actions for mutations)
│   │   ├── auth.actions.ts - register, login, logout, etc.
│   │   ├── reservations.actions.ts - create, delete
│   │   ├── transport.actions.ts - calculate, create
│   │   ├── devis.actions.ts - create
│   │   ├── messages.actions.ts - send
│   │   └── contact.actions.ts - submit
│   ├── /api (API routes)
│   │   ├── /hybrid (GET endpoints for listings)
│   │   │   ├── /produits/route.ts
│   │   │   ├── /categories/route.ts
│   │   │   ├── /reservations/route.ts
│   │   │   ├── /transport/route.ts
│   │   │   ├── /devis/route.ts
│   │   │   ├── /messages/route.ts
│   │   │   └── /profil/route.ts
│   │   └── (no client endpoints here)
│   └── /components
│       ├── forms
│       │   ├── RegisterForm.tsx - uses registerAction
│       │   ├── LoginForm.tsx - uses loginAction
│       │   └── etc.
│       └── hooks
│           └── queries.ts - useQuery hooks
└── src/
    └── /services (business logic)
        ├── auth.service.ts
        ├── reservation.service.ts
        └── etc.
```

---

## Three Endpoint Types Explained

### 1️⃣ HYBRID - GET API Routes (`/api/hybrid/*`)

**Purpose**: Listing pages that need initial data + real-time updates

```typescript
// app/api/hybrid/produits/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "1";

  const products = await productService.getAllProducts({
    page: parseInt(page),
  });

  return Response.json({ success: true, data: products });
}
```

```typescript
// app/products/page.tsx (Server Component - Initial Load)
import { productService } from '@/services';

export default async function ProductsPage() {
  // Direct service call - no HTTP request
  const { data } = await productService.getAllProducts({ page: 1 });

  return <ProductsClient initialData={data} />;
}

// components/ProductsClient.tsx (Client Component - Real-time)
'use client'

export function ProductsClient({ initialData }) {
  const { data } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await fetch('/api/hybrid/produits');
      return res.json();
    },
    initialData,
    staleTime: 5 * 60 * 1000,
  });

  return <Display data={data} />;
}
```

---

### 2️⃣ CLIENT - Server Actions (`/app/actions/*`)

**Purpose**: Form submissions and user interactions (mutations)

```typescript
// app/actions/auth.actions.ts
"use server";

import { authService } from "@/services";

export async function registerAction(input: {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  pays: string;
  mot_de_passe: string;
}) {
  try {
    // Direct service call on server
    const user = await authService.register(input);

    // Can set cookies here
    cookies().set("token", user.token);

    return {
      success: true,
      data: {
        user: user.user,
        token: user.token,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}
```

```typescript
// components/RegisterForm.tsx
'use client'

import { useMutation } from '@tanstack/react-query';
import { registerAction } from '@/actions/auth.actions';

export function RegisterForm() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: registerAction,
    onSuccess: (result) => {
      if (result.success) {
        // Invalidate user queries
        queryClient.invalidateQueries({ queryKey: ['user'] });
        // Redirect
        redirect('/dashboard');
      }
    },
  });

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        mutation.mutate({
          nom: formData.get('nom'),
          prenom: formData.get('prenom'),
          email: formData.get('email'),
          telephone: formData.get('telephone'),
          pays: formData.get('pays'),
          mot_de_passe: formData.get('mot_de_passe'),
        });
      }}
    >
      <input name="nom" placeholder="Nom" required />
      <input name="prenom" placeholder="Prénom" required />
      <input name="email" type="email" placeholder="Email" required />
      <input name="telephone" placeholder="Téléphone" required />
      <input name="pays" placeholder="Pays" required />
      <input name="mot_de_passe" type="password" placeholder="Mot de passe" required />
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Inscription...' : 'S\'inscrire'}
      </button>
    </form>
  );
}
```

---

### 3️⃣ SERVER - Direct Service Calls (No API Routes)

**Purpose**: Detail pages, admin operations (server-only)

```typescript
// app/produits/[id]/page.tsx
import { productService } from '@/services';

export default async function ProductDetailPage({ params }) {
  try {
    // Direct service call - no HTTP request
    const product = await productService.getProductById(params.id);

    return <ProductDetail product={product} />;
  } catch (error) {
    notFound();
  }
}
```

---

## Comparison Table

| Aspect           | Hybrid                    | Client (Server Action)   | Server                |
| ---------------- | ------------------------- | ------------------------ | --------------------- |
| **Location**     | `/app/api/hybrid/*`       | `/app/actions/*`         | Direct import         |
| **Type**         | HTTP GET Route            | Server function          | Service import        |
| **Called from**  | Client (fetch) + Server   | Client only (via action) | Server Component only |
| **Use Case**     | Listing + updates         | Form submissions         | Detail pages          |
| **HTTP Request** | ✅ Yes (fetch)            | ❌ No (direct call)      | ❌ No (direct call)   |
| **Initial Data** | Server-side               | Server-side (in action)  | Server-side           |
| **Real-time**    | Client hook               | React Query mutation     | ❌ No                 |
| **Examples**     | Products list, categories | Register, login, delete  | Product detail, admin |

---

## Query Invalidation Pattern

```typescript
// After a Server Action mutation succeeds
const mutation = useMutation({
  mutationFn: createReservationAction,
  onSuccess: () => {
    // Invalidate the hybrid endpoint query
    queryClient.invalidateQueries({
      queryKey: ["reservations"],
    });
  },
});
```

---

## No API Routes for Mutations

### ❌ WRONG - Don't create `/api/client/*` routes

```typescript
// DON'T DO THIS
export async function POST(request: Request) {
  const data = await request.json();
  return Response.json(await registerUser(data));
}
```

### ✅ CORRECT - Use Server Actions instead

```typescript
// DO THIS
"use server";

export async function registerAction(data) {
  return await authService.register(data);
}
```

---

## Benefits of This Architecture

1. **Type Safety**: Server Actions provide end-to-end type checking
2. **Simpler Code**: No need for HTTP error handling in some cases
3. **Performance**: Smaller bundle size (Server Action code doesn't go to client)
4. **Security**: Sensitive logic stays on server
5. **Less Boilerplate**: No need for separate API routes + fetch calls

---

## Summary

- **Hybrid**: GET routes in `/api/hybrid/*` for data that needs SSR + client updates
- **Client**: Server Actions in `/app/actions/*` for form submissions and mutations
- **Server**: Direct service calls for server-only operations

**No Client-Only HTTP API routes** - use Server Actions instead!
