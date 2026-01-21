# PUT /admin/transport/:id/statut

**Type:** Server-Only (Direct Service Call)

## Description

Update transport status and add timeline entry (admin only).

## Headers

- `Authorization: Bearer {token}` (required, admin role)

## Body

```json
{
  "statut": "en_attente" | "marchandise_recue" | "en_transit" | "arrive" | "livre",
  "description": "string"
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

`admin`, `transport`, `mutation`, `server`, `update`

## Auth Required

Yes - Admin role only
