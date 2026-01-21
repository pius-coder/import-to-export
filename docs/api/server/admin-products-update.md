# PUT /admin/produits/:id

**Type:** Server-Only (Direct Service Call)

## Description

Update product information (admin only).

## Headers

- `Authorization: Bearer {token}` (required, admin role)

## Body

Same as POST /admin/produits

## Response 200

```json
{
  "success": true,
  "message": "Produit mis à jour"
}
```

## Tags

`admin`, `products`, `mutation`, `server`, `update`

## Auth Required

Yes - Admin role only
