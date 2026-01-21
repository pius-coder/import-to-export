# Quick Start: Implementation Guide

## Phase 1: Hybrid Endpoints (Listings)

Create GET API routes in `/app/api/hybrid/` for data that needs both SSR and client updates.

### Files to Create:

```
app/
└── api/
    └── hybrid/
        ├── produits/
        │   └── route.ts
        ├── categories/
        │   └── route.ts
        ├── reservations/
        │   └── route.ts
        ├── transport/
        │   └── route.ts
        ├── devis/
        │   └── route.ts
        ├── messages/
        │   └── route.ts
        ├── profil/
        │   └── route.ts
        └── accompagnement/
            └── formules
                └── route.ts
```

### Example Implementation:

```typescript
// app/api/hybrid/produits/route.ts
import { productService } from "@/services";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const categorie = searchParams.get("categorie");
    const prix_min = searchParams.get("prix_min");
    const prix_max = searchParams.get("prix_max");

    const products = await productService.getAllProducts({
      page,
      limit,
      filters: {
        categorie,
        prix_min: prix_min ? parseFloat(prix_min) : undefined,
        prix_max: prix_max ? parseFloat(prix_max) : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      data: products.data,
      pagination: products.pagination,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
```

---

## Phase 2: Client Mutations (Server Actions)

Create Server Actions in `/app/actions/` for form submissions and mutations.

### Files to Create:

```
app/
└── actions/
    ├── auth.actions.ts
    ├── reservations.actions.ts
    ├── transport.actions.ts
    ├── devis.actions.ts
    ├── messages.actions.ts
    ├── contact.actions.ts
    └── profile.actions.ts
```

### Example Implementation:

```typescript
// app/actions/auth.actions.ts
"use server";

import { authService } from "@/services";
import { cookies } from "next/headers";

export async function registerAction(input: {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  pays: string;
  mot_de_passe: string;
}) {
  try {
    const result = await authService.register(input);

    // Store token in httpOnly cookie
    cookies().set("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return {
      success: true,
      data: { user: result.user, token: result.token },
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Registration failed",
    };
  }
}

export async function loginAction(input: {
  email: string;
  mot_de_passe: string;
}) {
  try {
    const result = await authService.login(input.email, input.mot_de_passe);

    cookies().set("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return {
      success: true,
      data: { user: result.user, token: result.token },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Login failed",
    };
  }
}
```

---

## Phase 3: Server-Only Endpoints

Use direct service calls for detail pages and admin operations (no new files needed).

### Example Implementation:

```typescript
// app/produits/[id]/page.tsx
import { productService } from '@/services';

export default async function ProductPage({ params }) {
  try {
    // Direct service call - no HTTP request
    const product = await productService.getProductById(params.id);

    return (
      <div>
        <h1>{product.nom}</h1>
        <p>{product.description}</p>
        <p>Prix: {product.prix} {product.devise}</p>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
```

---

## React Query Setup

### 1. Create Hook Wrappers

```typescript
// lib/hooks/queries.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Hybrid queries
export const useProducts = (page = 1) => {
  return useQuery({
    queryKey: ["products", page],
    queryFn: async () => {
      const res = await fetch(`/api/hybrid/produits?page=${page}`);
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/hybrid/categories");
      return res.json();
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Client mutations (Server Actions)
export const useRegisterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};
```

### 2. Use in Components

```typescript
// app/produits/page.tsx (Server Component - Initial Load)
import { productService } from '@/services';
import { ProductsList } from '@/components/ProductsList';

export default async function ProduitsPage() {
  // Direct service call - get initial data
  const { data, pagination } = await productService.getAllProducts({
    page: 1,
    limit: 20
  });

  return <ProductsList initialData={data} initialPagination={pagination} />;
}

// components/ProductsList.tsx (Client Component - Real-time)
'use client'

export function ProductsList({ initialData, initialPagination }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useProducts(page, {
    initialData: page === 1 ? initialData : undefined,
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {data?.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// components/RegisterForm.tsx
'use client'

export function RegisterForm() {
  const mutation = useRegisterMutation();

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        mutation.mutate({
          nom: formData.get('nom'),
          // ... other fields
        });
      }}
    >
      {/* form fields */}
      <button disabled={mutation.isPending}>
        {mutation.isPending ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}
```

---

## Directory Structure After Implementation

```
project/
├── app/
│   ├── api/
│   │   └── hybrid/
│   │       ├── produits/route.ts
│   │       ├── categories/route.ts
│   │       ├── reservations/route.ts
│   │       ├── transport/route.ts
│   │       ├── devis/route.ts
│   │       ├── messages/route.ts
│   │       ├── profil/route.ts
│   │       └── accompagnement/formules/route.ts
│   ├── actions/
│   │   ├── auth.actions.ts
│   │   ├── reservations.actions.ts
│   │   ├── transport.actions.ts
│   │   ├── devis.actions.ts
│   │   ├── messages.actions.ts
│   │   ├── contact.actions.ts
│   │   └── profile.actions.ts
│   ├── components/
│   │   ├── ProductsList.tsx
│   │   ├── ProductDetail.tsx
│   │   └── forms/
│   ├── produits/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   └── ...
├── lib/
│   └── hooks/
│       └── queries.ts
├── src/
│   └── services/
│       ├── auth.service.ts
│       ├── product.service.ts
│       └── ...
└── docs/
    └── api/
        ├── README.md
        ├── ARCHITECTURE.md
        ├── CATEGORIZATION.md
        ├── hybrid/
        ├── client/
        └── server/
```

---

## Checklist

### Phase 1: Hybrid Routes

- [ ] Create `/app/api/hybrid/produits/route.ts`
- [ ] Create `/app/api/hybrid/categories/route.ts`
- [ ] Create `/app/api/hybrid/reservations/route.ts`
- [ ] Create `/app/api/hybrid/transport/route.ts`
- [ ] Create `/app/api/hybrid/devis/route.ts`
- [ ] Create `/app/api/hybrid/messages/route.ts`
- [ ] Create `/app/api/hybrid/profil/route.ts`
- [ ] Create `/app/api/hybrid/accompagnement/formules/route.ts`

### Phase 2: Server Actions

- [ ] Create `/app/actions/auth.actions.ts`
- [ ] Create `/app/actions/reservations.actions.ts`
- [ ] Create `/app/actions/transport.actions.ts`
- [ ] Create `/app/actions/devis.actions.ts`
- [ ] Create `/app/actions/messages.actions.ts`
- [ ] Create `/app/actions/contact.actions.ts`
- [ ] Create `/app/actions/profile.actions.ts`

### Phase 3: React Query Hooks

- [ ] Create `/lib/hooks/queries.ts`
- [ ] Add all useQuery hooks for hybrid endpoints
- [ ] Add all useMutation hooks for server actions

### Phase 4: Pages & Components

- [ ] Create listing pages using hybrid endpoints + hooks
- [ ] Create forms using server actions + mutations
- [ ] Create detail pages using direct service calls

---

## Testing Commands

```bash
# Test hybrid endpoint
curl http://localhost:3000/api/hybrid/produits

# Test with pagination
curl http://localhost:3000/api/hybrid/produits?page=2&limit=10

# Test with filters
curl "http://localhost:3000/api/hybrid/produits?categorie=electronics&prix_min=100&prix_max=500"
```
