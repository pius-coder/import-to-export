# GET /reservations

**Type:** Hybrid (Client Hook + Server SSR)

## Description

List all reservations for the authenticated user. Used for dashboard initialization and real-time updates.

## Headers

- `Authorization: Bearer {token}` (required)

## Query Parameters

- `statut`: string (optional) - Filter by status
- `page`: number (default: 1)

## Response 200

```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "numero_reservation": "string",
      "produit": {},
      "quantite": number,
      "statut": "string",
      "date_creation": "timestamp"
    }
  ]
}
```

## Tags

`reservations`, `user-data`, `hybrid`

## Auth Required

Yes - User token needed

## Update Triggers

- When reservation status changes (admin)
- When user creates new reservation
- When user cancels reservation
