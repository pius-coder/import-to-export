# POST /auth/reset-password

**Type:** Client-Only (useMutation)

## Description

Reset password with token from email.

## Body

```json
{
  "token": "string",
  "nouveau_mot_de_passe": "string"
}
```

## Response 200

```json
{
  "success": true,
  "message": "Mot de passe réinitialisé"
}
```

## Tags

`auth`, `password-recovery`, `mutation`

## Error Handling

- 401: Invalid or expired token
