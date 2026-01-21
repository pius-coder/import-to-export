# POST /auth/login

**Type:** Client-Only (useMutation)

## Description

User login with email and password.

## Body

```json
{
  "email": "string",
  "mot_de_passe": "string"
}
```

## Response 200

```json
{
  "success": true,
  "token": "string",
  "user": {
    "id": "string",
    "email": "string",
    "nom": "string",
    "role": "client" | "admin"
  }
}
```

## Tags

`auth`, `login`, `mutation`

## Side Effects

- Store token in localStorage/cookies
- Redirect to dashboard
- Invalidate all previous queries
