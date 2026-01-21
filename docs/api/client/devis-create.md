# POST /devis

**Type:** Client-Only (useMutation)

## Description

Request a quote for services.

## Body

```json
{
  "type_service": "achat" | "transport" | "accompagnement",
  "nom": "string",
  "email": "string",
  "telephone": "string",
  "pays": "string",
  "details": "string"
}
```

## Response 201

```json
{
  "success": true,
  "message": "Devis envoyé, vous recevrez une réponse sous 24h",
  "data": {
    "id": "string",
    "numero_devis": "string",
    "date_creation": "timestamp"
  }
}
```

## Tags

`devis`, `quotes`, `mutation`, `create`

## Auth Required

No - Public endpoint
