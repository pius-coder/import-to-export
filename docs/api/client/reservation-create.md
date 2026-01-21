# POST /reservations

**Type:** Client-Only (useMutation)

## Description

Create a new product reservation.

## Headers

- `Authorization: Bearer {token}` (required)

## Body

```json
{
  "produit_id": "string",
  "quantite": number,
  "notes": "string"
}
```

## Response 201

```json
{
  "success": true,
  "message": "Réservation créée",
  "data": {
    "id": "string",
    "numero_reservation": "string",
    "produit": {},
    "quantite": number,
    "statut": "en_attente",
    "date_creation": "timestamp"
  }
}
```

## Tags

`reservations`, `mutation`, `create`

## Invalidate

- `reservations` query to refresh list
