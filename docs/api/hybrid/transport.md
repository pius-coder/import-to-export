# GET /transport

**Type:** Hybrid (Client Hook + Server SSR)

## Description

List all transport requests for the authenticated user. Used for tracking dashboard.

## Headers

- `Authorization: Bearer {token}` (required)

## Response 200

```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "numero_transport": "string",
      "pays_depart": "string",
      "pays_destination": "string",
      "statut": "string",
      "date_creation": "timestamp"
    }
  ]
}
```

## Tags

`transport`, `tracking`, `user-data`, `hybrid`

## Auth Required

Yes - User token needed

## Real-time Updates

Recommended for WebSocket/polling updates on shipment status
