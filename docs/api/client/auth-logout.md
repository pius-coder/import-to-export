# POST /auth/logout

**Type:** Client-Only (useMutation)

## Description

User logout and invalidate token.

## Headers

- `Authorization: Bearer {token}` (required)

## Response 200

```json
{
  "success": true,
  "message": "Déconnexion réussie"
}
```

## Tags

`auth`, `logout`, `mutation`

## Side Effects

- Clear token from storage
- Redirect to login page
- Invalidate all queries
