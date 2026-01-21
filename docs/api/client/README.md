# Client-Only Endpoints

These endpoints handle **user interactions** (forms, mutations) and use **Server Actions** with **React Query useMutation** hook. They are called **only from the client** with user events.

## Implementation Pattern

```typescript
// Server Action (actions.ts)
"use server";

export async function registerUser(formData) {
  // Direct service call on server
  const result = await authService.register({
    nom: formData.get("nom"),
    prenom: formData.get("prenom"),
    email: formData.get("email"),
    telephone: formData.get("telephone"),
    pays: formData.get("pays"),
    mot_de_passe: formData.get("mot_de_passe"),
  });

  return result;
}

// Client Component with Mutation Hook
("use client");

export const useRegisterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      // Call Server Action directly
      const result = await registerUser(data);
      return result;
    },
    onSuccess: () => {
      // Invalidate related queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      console.error("Mutation failed:", error);
    },
  });
};
```

## Endpoints

### Authentication

- [POST /auth/register](./auth-register.md)
- [POST /auth/login](./auth-login.md)
- [POST /auth/logout](./auth-logout.md)
- [POST /auth/forgot-password](./auth-forgot-password.md)
- [POST /auth/reset-password](./auth-reset-password.md)

### Products & Reservations

- [POST /reservations](./reservation-create.md)
- [DELETE /reservations/:id](./reservation-delete.md)

### Transport

- [POST /transport/calculer](./transport-calculate.md)
- [POST /transport](./transport-create.md)

### Quotes

- [POST /devis](./devis-create.md)

### Services

- [POST /accompagnement/demande](./accompagnement-request.md)

### Profile

- [PUT /profil](./profile-update.md)

### Messaging

- [POST /messages](./messages-send.md)

### Public Contact

- [POST /contact](./contact-submit.md)
