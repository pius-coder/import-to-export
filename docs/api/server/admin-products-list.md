# GET /admin/produits

**Type:** Server-Only (Direct Service Call)

## Description

List all products for admin management.

## Headers

- `Authorization: Bearer {token}` (required, admin role)

## Query Parameters

- `page`: number (default: 1)
- `limit`: number (default: 20)
- `statut`: string (optional)

## Response 200

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": number,
    "limit": number,
    "total": number,
    "pages": number
  }
}
```

## Tags

`admin`, `products`, `listing`, `server`

## Auth Required

Yes - Admin role only
