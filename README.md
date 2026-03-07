## CRM+ Frontend (React / Vite)

This is the React frontend for the **Lead Management System (CRM+)** MERN assignment. It implements a production-style SPA with authentication, RBAC-based UI, lead management, analytics dashboard, and realtime notifications.


### Environment Variables

Copy these values in `.env` and adjust:

- `VITE_APP_NAME` – application title (display only).
- `VITE_API_BASE_URL` – REST API base URL (e.g. `http://localhost:5000/api`).
- `VITE_SOCKET_URL` – Socket.IO server URL (e.g. `http://localhost:5000`).

> All HTTP requests use `VITE_API_BASE_URL`, and all sockets connect using `VITE_SOCKET_URL`. Vite exposes these as `import.meta.env.VITE_*`.

### Running the App

```bash
cd crm-frontend
npm install          # already done once, but safe to run# edit .env to point to your backend
npm run dev
```


### Tech Stack

- **React + Vite**
- **React Router** for routing and protected routes
- **Axios** API client with JWT auth header + 401 handling
- **Socket.IO client** for realtime notifications
- **date-fns** for date formatting

### Folder Structure

- `src/main.jsx` – App entry, wraps router + providers.
- `src/App.jsx` – Route definitions.
- `src/context/` – `AuthContext`, `SocketContext`.
- `src/hooks/` – `useAuth` convenience hook.
- `src/services/` – API clients (`authApi`, `leadsApi`, `dashboardApi`, `notificationsApi`, `apiClient`).
- `src/utils/` – `storage` (localStorage), `permissions` (roles/permissions map + helpers).
- `src/components/`
  - `layout/AppLayout.jsx` – main shell (header, nav, sidebar).
  - `routing/ProtectedRoute.jsx`, `PublicRoute.jsx`.
  - `common/` – shared UI: `FormField`, `PageHeader`, `Pagination`, `StatusBadge`, `EmptyState`, `ErrorAlert`, `LoadingOverlay`.
  - `notifications/NotificationBell.jsx`.
- `src/pages/`
  - `auth/` – `LoginPage`, `RegisterPage`.
  - `leads/` – `LeadsListPage`, `LeadFormPage`.
  - `dashboard/` – `DashboardPage`.
  - `notifications/` – `NotificationsPage`.
  - `NotFoundPage.jsx`.
