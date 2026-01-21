# POST /admin/auth/login

**Type:** Server-Only (Direct Service Call)

## Description

Admin login. Should be called from admin page server component or protected route.

## Body

```json
{
  "email": "string",
  "mot_de_passe": "string"
}
```

## Response 200

```json
{
  "success": true,
  "token": "string",
  "admin": {
    "id": "string",
    "email": "string",
    "nom": "string",
    "role": "admin"
  }
}
```

## Tags

`admin`, `auth`, `login`, `server`

## Implementation

```typescript
import { adminService } from "@/services";

const result = await adminService.login(email, password);
```
