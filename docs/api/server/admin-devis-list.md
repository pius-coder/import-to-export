# GET /admin/devis

**Type:** Server-Only (Direct Service Call)

## Description

List all quotes for admin.

## Headers

- `Authorization: Bearer {token}` (required, admin role)

## Query Parameters

- `statut`: string (optional)
- `page`: number (default: 1)

## Response 200

```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "numero_devis": "string",
      "client": {},
      "type_service": "string",
      "statut": "string",
      "date_creation": "timestamp"
    }
  ]
}
```

## Tags

`admin`, `devis`, `quotes`, `listing`, `server`

## Auth Required

Yes - Admin role only
