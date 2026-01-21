# GET /messages

**Type:** Hybrid (Client Hook + Server SSR)

## Description

List all conversations for the authenticated user.

## Headers

- `Authorization: Bearer {token}` (required)

## Response 200

```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "sujet": "string",
      "dernier_message": "string",
      "non_lu": boolean,
      "date": "timestamp"
    }
  ]
}
```

## Tags

`messages`, `conversations`, `user-data`, `hybrid`

## Auth Required

Yes - User token needed

## Real-time Updates

Recommended for WebSocket for real-time message notifications
