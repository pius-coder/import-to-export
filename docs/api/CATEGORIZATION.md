# API Endpoints Categorization Summary

## Hybrid Endpoints (8)

Data that needs **both client-side interactivity and server-side initial loading**.

| Endpoint                   | Method | Auth | Description                   |
| -------------------------- | ------ | ---- | ----------------------------- |
| `/produits`                | GET    | ❌   | Products listing with filters |
| `/categories`              | GET    | ❌   | Product categories            |
| `/reservations`            | GET    | ✅   | User's reservations list      |
| `/transport`               | GET    | ✅   | User's transport requests     |
| `/devis`                   | GET    | ✅   | User's quotes                 |
| `/profil`                  | GET    | ✅   | User profile info             |
| `/messages`                | GET    | ✅   | Conversations list            |
| `/accompagnement/formules` | GET    | ❌   | Services formulas             |

---

## Client Endpoints (15+)

**useMutation hooks** for user interactions and form submissions.

### Authentication (5)

| Endpoint                | Method | Auth | Description               |
| ----------------------- | ------ | ---- | ------------------------- |
| `/auth/register`        | POST   | ❌   | User registration         |
| `/auth/login`           | POST   | ❌   | User login                |
| `/auth/logout`          | POST   | ✅   | User logout               |
| `/auth/forgot-password` | POST   | ❌   | Request password reset    |
| `/auth/reset-password`  | POST   | ❌   | Reset password with token |

### Reservations (2)

| Endpoint            | Method | Auth | Description        |
| ------------------- | ------ | ---- | ------------------ |
| `/reservations`     | POST   | ✅   | Create reservation |
| `/reservations/:id` | DELETE | ✅   | Cancel reservation |

### Transport (2)

| Endpoint              | Method | Auth | Description              |
| --------------------- | ------ | ---- | ------------------------ |
| `/transport/calculer` | POST   | ❌   | Calculate transport cost |
| `/transport`          | POST   | ✅   | Create transport request |

### Quotes (1)

| Endpoint | Method | Auth | Description   |
| -------- | ------ | ---- | ------------- |
| `/devis` | POST   | ❌   | Request quote |

### Services (1)

| Endpoint                  | Method | Auth | Description           |
| ------------------------- | ------ | ---- | --------------------- |
| `/accompagnement/demande` | POST   | ✅   | Request accompaniment |

### Profile (1)

| Endpoint  | Method | Auth | Description    |
| --------- | ------ | ---- | -------------- |
| `/profil` | PUT    | ✅   | Update profile |

### Messages (1)

| Endpoint    | Method | Auth | Description  |
| ----------- | ------ | ---- | ------------ |
| `/messages` | POST   | ✅   | Send message |

### Public (1)

| Endpoint   | Method | Auth | Description  |
| ---------- | ------ | ---- | ------------ |
| `/contact` | POST   | ❌   | Contact form |

---

## Server Endpoints (25+)

**Direct service calls** - server-side only operations.

### Detail Fetching (5)

| Endpoint            | Method | Auth | Description          |
| ------------------- | ------ | ---- | -------------------- |
| `/produits/:id`     | GET    | ❌   | Product details      |
| `/reservations/:id` | GET    | ✅   | Reservation details  |
| `/transport/:id`    | GET    | ✅   | Transport details    |
| `/devis/:id`        | GET    | ✅   | Quote details        |
| `/messages/:id`     | GET    | ✅   | Conversation details |

### Authentication (2)

| Endpoint              | Method | Auth | Description       |
| --------------------- | ------ | ---- | ----------------- |
| `/auth/refresh-token` | POST   | ✅   | Refresh JWT token |
| `/admin/auth/login`   | POST   | ❌   | Admin login       |

### Admin Dashboard (1)

| Endpoint                 | Method | Auth      | Description          |
| ------------------------ | ------ | --------- | -------------------- |
| `/admin/dashboard/stats` | GET    | ✅(admin) | Dashboard statistics |

### Admin Products (4)

| Endpoint              | Method | Auth      | Description       |
| --------------------- | ------ | --------- | ----------------- |
| `/admin/produits`     | GET    | ✅(admin) | List all products |
| `/admin/produits`     | POST   | ✅(admin) | Create product    |
| `/admin/produits/:id` | PUT    | ✅(admin) | Update product    |
| `/admin/produits/:id` | DELETE | ✅(admin) | Delete product    |

### Admin Reservations (2)

| Endpoint                         | Method | Auth      | Description           |
| -------------------------------- | ------ | --------- | --------------------- |
| `/admin/reservations`            | GET    | ✅(admin) | List all reservations |
| `/admin/reservations/:id/statut` | PUT    | ✅(admin) | Update status         |

### Admin Transport (3)

| Endpoint                        | Method | Auth      | Description         |
| ------------------------------- | ------ | --------- | ------------------- |
| `/admin/transport`              | GET    | ✅(admin) | List all transports |
| `/admin/transport/:id/statut`   | PUT    | ✅(admin) | Update status       |
| `/admin/transport/:id/document` | POST   | ✅(admin) | Add document        |

### Admin Quotes (2)

| Endpoint                    | Method | Auth      | Description         |
| --------------------------- | ------ | --------- | ------------------- |
| `/admin/devis`              | GET    | ✅(admin) | List all quotes     |
| `/admin/devis/:id/repondre` | PUT    | ✅(admin) | Send quote response |

### Admin Clients (2)

| Endpoint             | Method | Auth      | Description      |
| -------------------- | ------ | --------- | ---------------- |
| `/admin/clients`     | GET    | ✅(admin) | List all clients |
| `/admin/clients/:id` | GET    | ✅(admin) | Client details   |

### Admin Messages (2)

| Endpoint              | Method | Auth      | Description        |
| --------------------- | ------ | --------- | ------------------ |
| `/admin/messages`     | GET    | ✅(admin) | List conversations |
| `/admin/messages/:id` | POST   | ✅(admin) | Send reply         |

---

## Statistics

| Category   | Count | Auth Required | Public |
| ---------- | ----- | ------------- | ------ |
| **Hybrid** | 8     | 4             | 4      |
| **Client** | 15+   | 8             | 7+     |
| **Server** | 25+   | 20+           | 5      |
| **Total**  | 48+   | 32+           | 16+    |

---

## Implementation Order

1. ✅ **API Documentation** - DONE
2. 📋 **Implement Hybrid Endpoints** - Next (server + client)
3. 📋 **Implement Client Endpoints** - Then (mutations)
4. 📋 **Implement Server Endpoints** - Finally (detail & admin)

---

## File Structure

```
docs/api/
├── README.md (main guide)
├── CATEGORIZATION.md (this file)
├── hybrid/
│   ├── README.md
│   ├── products.md
│   ├── categories.md
│   ├── reservations.md
│   ├── transport.md
│   ├── devis.md
│   ├── profile.md
│   ├── messages.md
│   └── accompagnement.md
├── client/
│   ├── README.md
│   ├── auth-register.md
│   ├── auth-login.md
│   ├── auth-logout.md
│   ├── auth-forgot-password.md
│   ├── auth-reset-password.md
│   ├── reservation-create.md
│   ├── reservation-delete.md
│   ├── transport-calculate.md
│   ├── transport-create.md
│   ├── devis-create.md
│   ├── accompagnement-request.md
│   ├── profile-update.md
│   ├── messages-send.md
│   └── contact-submit.md
└── server/
    ├── README.md
    ├── products-detail.md
    ├── reservations-detail.md
    ├── transport-detail.md
    ├── devis-detail.md
    ├── messages-detail.md
    ├── auth-refresh.md
    ├── admin-auth-login.md
    ├── admin-dashboard-stats.md
    ├── admin-products-*.md
    ├── admin-reservations-*.md
    ├── admin-transport-*.md
    ├── admin-devis-*.md
    ├── admin-clients-*.md
    └── admin-messages-*.md
```
