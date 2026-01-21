# GET /accompagnement/formules

**Type:** Hybrid (Client Hook + Server SSR)

## Description

List all coaching/accompaniment formulas. Used for services page.

## Response 200

```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "nom": "Basic",
      "description": "string",
      "services_inclus": ["string"],
      "prix": number,
      "devise": "string"
    }
  ]
}
```

## Tags

`accompaniment`, `services`, `listing`, `hybrid`

## Cache Strategy

- Cache for 1 hour (rarely changes)
