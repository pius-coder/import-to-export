# GET /produits/:id

**Type:** Server-Only (Direct Service Call)

## Description

Get detailed product information. Server-side only via direct service call.

## URL Parameters

- `id`: Product ID (required)

## Response

```json
{
  "success": true,
  "data": {
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
    "caracteristiques": {},
    "disponible": boolean
  }
}
```

## Tags

`products`, `detail`, `server`

## Implementation

```typescript
import { productService } from "@/services";

const product = await productService.getProductById(id);
```
