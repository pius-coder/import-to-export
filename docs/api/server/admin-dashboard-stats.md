# GET /admin/dashboard/stats

**Type:** Server-Only (Direct Service Call)

## Description

Get admin dashboard statistics. Server-side only for security.

## Headers

- `Authorization: Bearer {token}` (required, admin role)

## Response 200

```json
{
  "success": true,
  "data": {
    "nouvelles_reservations": number,
    "transports_en_cours": number,
    "devis_en_attente": number,
    "revenus_mois": number,
    "nombre_clients": number
  }
}
```

## Tags

`admin`, `dashboard`, `stats`, `server`

## Auth Required

Yes - Admin role only

## Implementation

```typescript
import { adminService } from "@/services";

const stats = await adminService.getDashboardStats();
```
