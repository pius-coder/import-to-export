# POST /messages

**Type:** Client-Only (useMutation)

## Description

Send a message in a conversation.

## Headers

- `Authorization: Bearer {token}` (required)

## Body

```json
{
  "conversation_id": "string",
  "contenu": "string"
}
```

## Response 201

```json
{
  "success": true,
  "data": {
    "id": "string",
    "contenu": "string",
    "date": "timestamp"
  }
}
```

## Tags

`messages`, `conversations`, `mutation`, `create`

## Invalidate

- Specific conversation query
- Conversations list (last message)
