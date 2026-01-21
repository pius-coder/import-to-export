# GET /admin/transport

**Type:** Server-Only (Direct Service Call)

## Description

List all transport requests for admin.

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
      "numero_transport": "string",
      "client": {},
      "pays_depart": "string",
      "pays_destination": "string",
      "statut": "string",
      "date_creation": "timestamp"
    }
  ]
}
```

## Tags

`admin`, `transport`, `listing`, `server`

## Auth Required

Yes - Admin role only
