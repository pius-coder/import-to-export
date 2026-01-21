# GET /messages/:id

**Type:** Server-Only (Direct Service Call)

## Description

Get detailed conversation with all messages.

## Headers

- `Authorization: Bearer {token}` (required)

## URL Parameters

- `id`: Conversation ID (required)

## Response

```json
{
  "success": true,
  "data": {
    "id": "string",
    "sujet": "string",
    "messages": [
      {
        "id": "string",
        "expediteur": "string",
        "contenu": "string",
        "date": "timestamp",
        "lu": boolean
      }
    ]
  }
}
```

## Tags

`messages`, `conversations`, `detail`, `server`

## Implementation

```typescript
import { messageService } from "@/services";

const conversation = await messageService.getConversation(id);
```
