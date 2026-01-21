# PUT /admin/reservations/:id/statut

**Type:** Server-Only (Direct Service Call)

## Description

Update reservation status (admin only).

## Headers

- `Authorization: Bearer {token}` (required, admin role)

## Body

```json
{
  "statut": "confirmee" | "annulee" | "traitee",
  "notes": "string"
}
```

## Response 200

```json
{
  "success": true,
  "message": "Statut mis à jour"
}
```

## Tags

`admin`, `reservations`, `mutation`, `server`, `update`

## Auth Required

Yes - Admin role only
