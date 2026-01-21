# GET /admin/messages

**Type:** Server-Only (Direct Service Call)

## Description

List all conversations for admin.

## Headers

- `Authorization: Bearer {token}` (required, admin role)

## Response 200

```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "client": {},
      "sujet": "string",
      "dernier_message": "string",
      "non_lu": boolean,
      "date": "timestamp"
    }
  ]
}
```

## Tags

`admin`, `messages`, `conversations`, `listing`, `server`

## Auth Required

Yes - Admin role only
