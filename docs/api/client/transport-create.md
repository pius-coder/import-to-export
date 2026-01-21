# POST /transport

**Type:** Client-Only (useMutation)

## Description

Create a new transport request.

## Headers

- `Authorization: Bearer {token}` (required)

## Body

```json
{
  "pays_depart": "string",
  "pays_destination": "string",
  "type_marchandise": "string",
  "poids": number,
  "volume": number,
  "mode_transport": "maritime" | "aerien",
  "description": "string"
}
```

## Response 201

```json
{
  "success": true,
  "message": "Demande de transport créée",
  "data": {
    "id": "string",
    "numero_transport": "string",
    "statut": "en_attente",
    "prix_estime": number,
    "date_creation": "timestamp"
  }
}
```

## Tags

`transport`, `mutation`, `create`

## Invalidate

- `transport` query list
