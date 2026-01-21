# POST /accompagnement/demande

**Type:** Client-Only (useMutation)

## Description

Request accompaniment/coaching service.

## Headers

- `Authorization: Bearer {token}` (required)

## Body

```json
{
  "formule_id": "string",
  "description_projet": "string",
  "budget_estime": number
}
```

## Response 201

```json
{
  "success": true,
  "message": "Demande d'accompagnement envoyée",
  "data": {
    "id": "string",
    "numero_demande": "string",
    "statut": "en_attente"
  }
}
```

## Tags

`accompaniment`, `services`, `mutation`, `create`

## Invalidate

- Related devis queries
