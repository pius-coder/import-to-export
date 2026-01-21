# PUT /profil

**Type:** Client-Only (useMutation)

## Description

Update user profile information.

## Headers

- `Authorization: Bearer {token}` (required)

## Body

```json
{
  "nom": "string",
  "prenom": "string",
  "telephone": "string",
  "pays": "string",
  "adresse": "string"
}
```

## Response 200

```json
{
  "success": true,
  "message": "Profil mis à jour",
  "data": {}
}
```

## Tags

`profile`, `user-data`, `mutation`, `update`

## Invalidate

- `profile` query
- `user-info` query
