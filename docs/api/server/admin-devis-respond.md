# PUT /admin/devis/:id/repondre

**Type:** Server-Only (Direct Service Call)

## Description

Send quote response to client (admin only).

## Headers

- `Authorization: Bearer {token}` (required, admin role)

## Body

```json
{
  "reponse": "string",
  "montant": number,
  "devise": "string",
  "delai": "string"
}
```

## Response 200

```json
{
  "success": true,
  "message": "Réponse envoyée au client"
}
```

## Tags

`admin`, `devis`, `quotes`, `mutation`, `server`, `update`

## Auth Required

Yes - Admin role only
