# GET /categories

**Type:** Hybrid (Client Hook + Server SSR)

## Description

List all product categories. Used for filter dropdowns and initial page load.

## Response 200

```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "nom": "string",
      "slug": "string",
      "nombre_produits": number
    }
  ]
}
```

## Tags

`categories`, `listing`, `hybrid`

## Cache Strategy

- Revalidate every 30 minutes
- Cache on CDN for 1 hour
