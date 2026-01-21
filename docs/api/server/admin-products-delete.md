# DELETE /admin/produits/:id

**Type:** Server-Only (Direct Service Call)

## Description

Delete a product (admin only).

## Headers

- `Authorization: Bearer {token}` (required, admin role)

## Response 200

```json
{
  "success": true,
  "message": "Produit supprimé"
}
```

## Tags

`admin`, `products`, `mutation`, `server`, `delete`

## Auth Required

Yes - Admin role only
