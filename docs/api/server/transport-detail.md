# GET /transport/:id

**Type:** Server-Only (Direct Service Call)

## Description

Get detailed transport information with timeline and documents.

## Headers

- `Authorization: Bearer {token}` (required)

## URL Parameters

- `id`: Transport ID (required)

## Response

```json
{
  "success": true,
  "data": {
    "id": "string",
    "numero_transport": "string",
    "pays_depart": "string",
    "pays_destination": "string",
    "type_marchandise": "string",
    "poids": number,
    "volume": number,
    "mode_transport": "string",
    "statut": "string",
    "prix": number,
    "timeline": [
      {
        "etape": "string",
        "date": "timestamp",
        "description": "string"
      }
    ],
    "documents": [
      {
        "nom": "string",
        "url": "string",
        "type": "string"
      }
    ]
  }
}
```

## Tags

`transport`, `detail`, `server`, `tracking`

## Implementation

```typescript
import { transportService } from "@/services";

const transport = await transportService.getTransportById(id);
```
