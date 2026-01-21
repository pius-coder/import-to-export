# GET /produits

**Type:** Hybrid (Client Hook + Server SSR)

## Description

List all products with optional filters. Used for initial page load and product browsing.

## Query Parameters

- `categorie`: string (optional)
- `pays_origine`: string (optional)
- `prix_min`: number (optional)
- `prix_max`: number (optional)
- `page`: number (default: 1)
- `limit`: number (default: 20)

## Response 200

```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "nom": "string",
      "description": "string",
      "prix": number,
      "devise": "string",
      "categorie": "string",
      "pays_origine": "string",
      "quantite_minimum": number,
      "delai_livraison": "string",
      "images": ["url1", "url2"],
      "disponible": boolean
    }
  ],
  "pagination": {
    "page": number,
    "limit": number,
    "total": number,
    "pages": number
  }
}
```

## Tags

`products`, `listing`, `hybrid`

## Use Cases

- Product listing page initial load
- Search and filter
- Pagination
- Real-time updates on client
