# POST /admin/produits

**Type:** Server-Only (Direct Service Call)

## Description

Create a new product (admin only).

## Headers

- `Authorization: Bearer {token}` (required, admin role)

## Body

```json
{
  "nom": "string",
  "description": "string",
  "prix": number,
  "devise": "string",
  "categorie_id": "string",
  "pays_origine": "string",
  "quantite_minimum": number,
  "delai_livraison": "string",
  "caracteristiques": {},
  "images": ["url"]
}
```

## Response 201

```json
{
  "success": true,
  "message": "Produit créé",
  "data": {}
}
```

## Tags

`admin`, `products`, `mutation`, `server`, `create`

## Auth Required

Yes - Admin role only
