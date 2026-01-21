# POST /admin/transport/:id/document

**Type:** Server-Only (Direct Service Call)

## Description

Add document to transport (admin only).

## Headers

- `Authorization: Bearer {token}` (required, admin role)

## Body

```json
{
  "nom": "string",
  "type": "string",
  "url": "string"
}
```

## Response 201

```json
{
  "success": true,
  "message": "Document ajouté"
}
```

## Tags

`admin`, `transport`, `documents`, `server`, `create`

## Auth Required

Yes - Admin role only
