# POST /auth/forgot-password

**Type:** Client-Only (useMutation)

## Description

Request password reset email.

## Body

```json
{
  "email": "string"
}
```

## Response 200

```json
{
  "success": true,
  "message": "Email de réinitialisation envoyé"
}
```

## Tags

`auth`, `password-recovery`, `mutation`

## Note

Returns success regardless of email existence for security reasons.
