# GET /reservations/:id

**Type:** Server-Only (Direct Service Call)

## Description

Get detailed reservation information with product details.

## Headers

- `Authorization: Bearer {token}` (required)

## URL Parameters

- `id`: Reservation ID (required)

## Response

```json
{
  "success": true,
  "data": {
    "id": "string",
    "numero_reservation": "string",
    "produit": {},
    "quantite": number,
    "prix_total": number,
    "statut": "string",
    "notes": "string",
    "date_creation": "timestamp"
  }
}
```

## Tags

`reservations`, `detail`, `server`

## Implementation

```typescript
import { reservationService } from "@/services";

const reservation = await reservationService.getReservationById(id);
```
