# GET /admin/clients/:id

**Type:** Server-Only (Direct Service Call)

## Description

Get detailed client information with all related data (admin only).

## Headers

- `Authorization: Bearer {token}` (required, admin role)

## URL Parameters

- `id`: Client ID (required)

## Response 200

```json
{
  "success": true,
  "data": {
    "informations": {},
    "reservations": [],
    "transports": [],
    "devis": []
  }
}
```

## Tags

`admin`, `clients`, `detail`, `server`

## Auth Required

Yes - Admin role only
