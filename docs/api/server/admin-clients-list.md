# GET /admin/clients

**Type:** Server-Only (Direct Service Call)

## Description

List all clients for admin.

## Headers

- `Authorization: Bearer {token}` (required, admin role)

## Query Parameters

- `page`: number (default: 1)
- `recherche`: string (optional)

## Response 200

```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "nom": "string",
      "prenom": "string",
      "email": "string",
      "telephone": "string",
      "pays": "string",
      "date_inscription": "timestamp",
      "nombre_commandes": number
    }
  ]
}
```

## Tags

`admin`, `clients`, `listing`, `server`

## Auth Required

Yes - Admin role only
