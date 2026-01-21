# POST /auth/refresh-token

**Type:** Server-Only (Direct Service Call)

## Description

Refresh authentication token. Typically called server-side before token expiration.

## Headers

- `Authorization: Bearer {token}` (required)

## Response

```json
{
  "success": true,
  "token": "string"
}
```

## Tags

`auth`, `token`, `server`

## Use Case

- Middleware to keep user sessions alive
- Server-side token refresh strategy
