# GET /profil

**Type:** Hybrid (Client Hook + Server SSR)

## Description

Get user profile information. Used for dashboard and account pages.

## Headers

- `Authorization: Bearer {token}` (required)

## Response 200

```json
{
  "success": true,
  "data": {
    "id": "string",
    "nom": "string",
    "prenom": "string",
    "email": "string",
    "telephone": "string",
    "pays": "string",
    "adresse": "string",
    "date_inscription": "timestamp"
  }
}
```

## Tags

`profile`, `user-data`, `hybrid`

## Auth Required

Yes - User token needed

## Cache Strategy

- Revalidate on user interaction (30 minutes)
- Invalidate on profile update
