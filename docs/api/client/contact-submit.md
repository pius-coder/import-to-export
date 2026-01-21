# POST /contact

**Type:** Client-Only (useMutation)

## Description

Submit public contact form.

## Body

```json
{
  "nom": "string",
  "email": "string",
  "telephone": "string",
  "sujet": "string",
  "message": "string"
}
```

## Response 200

```json
{
  "success": true,
  "message": "Message envoyé, nous vous répondrons rapidement"
}
```

## Tags

`contact`, `public`, `mutation`, `create`

## Auth Required

No - Public endpoint

## Rate Limiting

Recommended: 5 requests per minute per IP
