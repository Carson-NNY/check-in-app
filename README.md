## Table of Contents

- [Technologies](#technologies)
- [Getting Started](#getting-started)
- [Directory Structure](#directory-structure)
- [App Structure Explained](#app-structure-explained)

  - [`/app`](#app)
  - [`/components`](#components)
  - [`/hooks`](#hooks)
  - [`/services`](#services)
  - [`middleware.ts`](#middlewarets)

- [API Routes](#api-routes)

---

## Technologies

- **Next.js 13** (App Router)
- **React** (17+)
- **Chakra UI** for UI components and spinners
- **TypeScript** for static typing

---

## Getting Started

1. **Clone the repo**

   ```bash
   git clone <repo-url>
   cd <project-directory>
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install

   # the packages required:
   npm install next react react-dom
   npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion
   npm install react-loading-skeleton

   ```

3. **Run the server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev

# when everything is in place, run it on production mode
# first build it:
npm run build
# then start the server:
npm start
```

## Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## Directory Structure

```text
/src
├─ middleware.ts
├─ app
│  ├─ globals.css
│  ├─ layout.tsx
│  ├─ loading.tsx
│  ├─ page.tsx
│  ├─ page.module.css
│  ├─ event_participants
│  │  └─ [id]
│  │     └─ page.tsx
│  └─ api
│     ├─ auth
│     │  ├─ login
│     │  │  └─ route.ts
│     │  └─ logout
│     │     └─ route.ts
│     ├─ events
│     │  └─ [...date]
│     ├─ statusUpdate
│     │  └─ [...data]
│     └─ eventParticipants
│        └─ [event_id]
│           └─ route.ts
├─ components
│  ├─ Button
│  ├─ Highlight
│  ├─ ErrorMessage
│  ├─ EventParticipantList
│  ├─ Event
│  │  ├─ Filters
│  │  └─ Sort
│  └─ SearchBox
├─ hooks
│  └─ useDebounce.ts
└─ services
   ├─ events.ts
   └─ participants.ts
```

Each folder groups related code:

- **`app/`**: Next.js App Router entrypoint, global styles, layouts, and dynamic/server components.
- **`components/`**: Reusable UI pieces (buttons, lists, filters).
- **`hooks/`**: Custom React hooks for logic reuse (debouncing inputs).
- **`services/`**: Encapsulated fetch logic for API calls.
- **`middleware.ts`**: Protects routes by checking authentication cookie and redirects unauthenticated users.

---

## App Structure Explained

### `/app`

- **`layout.tsx`**: Wraps all pages with shared UI (header, footer).
- **`page.tsx`**: The home page component—sets up filters, search, and lists events.
- **`loading.tsx`**: Displays a full-screen spinner while the app router loads.
- **`api/`**: Serverless functions handling authentication (`/login`, `/logout`), event CRUD (`/events/[...date]`), and check-in status updates (`/statusUpdate/[...data]`).
- **`event_participants/[id]/page.tsx`**: Dynamic route for individual event participant details.

### `/components`

Reusable UI building blocks:

- **`Button`**: Styled button with optional variants (e.g., logout button).
- **`Highlight`**: Emphasizes matching search terms in event titles.
- **`ErrorMessage`**: Centralized error display component.
- **`EventParticipantList`**: Renders participant lists with update controls.
- **`Event`**: Card and list views for events, with nested `Filters` and `Sort` subcomponents.
- **`SearchBox`**: Debounced input field for text filtering.

### `/hooks`

- **`useDebounce`**: Custom hook to delay updates of rapidly changing values (e.g., search input).

### `/services`

- **`events.ts`**: Server-agnostic functions to fetch event data.
- **`participants.ts`**: API calls for fetching and updating participant data.

### `middleware.ts`

Enforces authentication: intercepts all requests, checks for a valid session cookie, and redirects to `/login` if missing.

---

## API Routes

| Method | Path                                | Description                         |
| ------ | ----------------------------------- | ----------------------------------- |
| GET    | `/api/events/[year]/[month]/[day]`  | Fetch events by date                |
| POST   | `/api/statusUpdate/[id]/[status]`   | Update check-in status for a user   |
| GET    | `/api/eventParticipants/[event_id]` | Get participants for a given event  |
| POST   | `/api/auth/login`                   | Authenticate and set session cookie |
| POST   | `/api/auth/logout`                  | Destroy session and clear cookie    |

---
