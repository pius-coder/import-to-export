# POST /admin/messages/:conversation_id

**Type:** Server-Only (Direct Service Call)

## Description

Send reply to client in conversation (admin only).

## Headers

- `Authorization: Bearer {token}` (required, admin role)

## Body

```json
{
  "contenu": "string"
}
```

## Response 201

```json
{
  "success": true,
  "message": "Message envoyé"
}
```

## Tags

`admin`, `messages`, `conversations`, `mutation`, `server`, `create`

## Auth Required

Yes - Admin role only
