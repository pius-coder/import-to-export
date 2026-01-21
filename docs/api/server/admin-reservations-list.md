# GET /admin/reservations

**Type:** Server-Only (Direct Service Call)

## Description

List all reservations for admin (with filters).

## Headers

- `Authorization: Bearer {token}` (required, admin role)

## Query Parameters

- `statut`: string (optional)
- `date_debut`: date (optional)
- `date_fin`: date (optional)
- `page`: number (default: 1)

## Response 200

```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "numero_reservation": "string",
      "client": {},
      "produit": {},
      "quantite": number,
      "statut": "string",
      "date_creation": "timestamp"
    }
  ]
}
```

## Tags

`admin`, `reservations`, `listing`, `server`

## Auth Required

Yes - Admin role only
