# POST /transport/calculer

**Type:** Client-Only (useMutation)

## Description

Calculate transport costs for different modes.

## Body

```json
{
  "pays_depart": "string",
  "pays_destination": "string",
  "type_marchandise": "string",
  "poids": number,
  "volume": number
}
```

## Response 200

```json
{
  "success": true,
  "data": {
    "prix_maritime": number,
    "prix_aerien": number,
    "delai_maritime": "string",
    "delai_aerien": "string",
    "devise": "string"
  }
}
```

## Tags

`transport`, `calculation`, `mutation`

## Use Case

- Quote calculator on transport request form
