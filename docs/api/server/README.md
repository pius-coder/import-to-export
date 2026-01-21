# Server-Only API Endpoints

These endpoints are called **only from the server** with direct service invocations. They are used for:

- Fetching detailed data for authenticated routes
- Admin operations
- Server-side logic

## Implementation Pattern

```typescript
// Server Component or API Route (server-side only)
import { devisService } from '@/services';

export default async function Page() {
  try {
    // Direct service call - no HTTP request
    const devis = await devisService.getDevisById(id);
    return <DisplayDevis data={devis} />;
  } catch (error) {
    notFound();
  }
}
```

## Endpoints

### Detail Fetching

- [GET /produits/:id](./products-detail.md)
- [GET /reservations/:id](./reservations-detail.md)
- [GET /transport/:id](./transport-detail.md)
- [GET /devis/:id](./devis-detail.md)
- [GET /messages/:id](./messages-detail.md)

### Authentication

- [POST /auth/refresh-token](./auth-refresh.md)

### Admin - Authentication

- [POST /admin/auth/login](./admin-auth-login.md)

### Admin - Dashboard

- [GET /admin/dashboard/stats](./admin-dashboard-stats.md)

### Admin - Products

- [GET /admin/produits](./admin-products-list.md)
- [POST /admin/produits](./admin-products-create.md)
- [PUT /admin/produits/:id](./admin-products-update.md)
- [DELETE /admin/produits/:id](./admin-products-delete.md)

### Admin - Reservations

- [GET /admin/reservations](./admin-reservations-list.md)
- [PUT /admin/reservations/:id/statut](./admin-reservations-update.md)

### Admin - Transport

- [GET /admin/transport](./admin-transport-list.md)
- [PUT /admin/transport/:id/statut](./admin-transport-update.md)
- [POST /admin/transport/:id/document](./admin-transport-document.md)

### Admin - Quotes

- [GET /admin/devis](./admin-devis-list.md)
- [PUT /admin/devis/:id/repondre](./admin-devis-respond.md)

### Admin - Clients

- [GET /admin/clients](./admin-clients-list.md)
- [GET /admin/clients/:id](./admin-clients-detail.md)

### Admin - Messages

- [GET /admin/messages](./admin-messages-list.md)
- [POST /admin/messages/:conversation_id](./admin-messages-reply.md)
