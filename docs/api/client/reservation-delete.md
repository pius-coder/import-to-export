# DELETE /reservations/:id

**Type:** Client-Only (useMutation)

## Description

Cancel a reservation.

## Headers

- `Authorization: Bearer {token}` (required)

## Response 200

```json
{
  "success": true,
  "message": "Réservation annulée"
}
```

## Tags

`reservations`, `mutation`, `delete`

## Invalidate

- `reservations` query
