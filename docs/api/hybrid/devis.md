# GET /devis

**Type:** Hybrid (Client Hook + Server SSR)

## Description

List all quotes/devis for the authenticated user.

## Headers

- `Authorization: Bearer {token}` (required)

## Response 200

```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "numero_devis": "string",
      "type_service": "string",
      "statut": "string",
      "date_creation": "timestamp"
    }
  ]
}
```

## Tags

`devis`, `quotes`, `user-data`, `hybrid`

## Auth Required

Yes - User token needed
