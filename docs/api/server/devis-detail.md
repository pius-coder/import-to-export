# GET /devis/:id

**Type:** Server-Only (Direct Service Call)

## Description

Get detailed quote information.

## Headers

- `Authorization: Bearer {token}` (required)

## URL Parameters

- `id`: Quote ID (required)

## Response

```json
{
  "success": true,
  "data": {
    "id": "string",
    "numero_devis": "string",
    "type_service": "string",
    "details": "string",
    "statut": "string",
    "reponse": "string",
    "montant": number,
    "date_creation": "timestamp",
    "date_reponse": "timestamp"
  }
}
```

## Tags

`devis`, `quotes`, `detail`, `server`

## Implementation

```typescript
import { devisService } from "@/services";

const devis = await devisService.getDevisById(id);
```
