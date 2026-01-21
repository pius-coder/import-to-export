# POST /auth/register

**Type:** Client-Only (useMutation)

## Description

Register a new user account.

## Body

```json
{
  "nom": "string",
  "prenom": "string",
  "email": "string",
  "telephone": "string",
  "pays": "string",
  "mot_de_passe": "string"
}
```

## Response 201

```json
{
  "success": true,
  "message": "Compte créé avec succès",
  "user": {
    "id": "string",
    "email": "string",
    "nom": "string",
    "prenom": "string",
    "role": "client"
  },
  "token": "string"
}
```

## Tags

`auth`, `registration`, `mutation`

## Error Handling

- 409: Email already exists
- 422: Validation failed
