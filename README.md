# MoMath Check-in

## Table of Contents

- [Technologies](#technologies)
- [Getting Started](#getting-started)
- [Directory Structure](#directory-structure)
- [App Structure Explained](#app-structure-explained)

  - [`/src`](#src)
  - [`/src/app`](#srcapp)
  - [`/src/components`](#srccomponents)
  - [`/src/hooks`](#srchooks)
  - [`/src/services`](#srcservices)
  - [`/src/schemas`](#srcschemas)
  - [`middleware.ts`](#middlewarets)

- [API Routes](#api-routes)

---

## Technologies

- **Next.js 13** (App Router)
- **React** (17+)
- **Chakra UI** for UI components
- **TypeScript** for static typing
- **Zod** for declarative schema validation

---

## Getting Started

1. **Clone the repo**

   ```bash
   git clone https://github.com/MoMath1/momath.tech.check-in-system.git
   ```

2. **Create and set enviornment variables in .env.local under root directory**
   ```bash
   MOMATH_CHECKIN_PASSWORD=<Password for login page>
   CIVICRM_API_KEY=<CIVI API KEY>
   CIVICRM_BASE_URL=https://sandbox.momath.org/civicrm/ajax/api4
   ```
3. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

4. **Add peer packages**

   ```bash
   npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion
   npm install @chakra-ui/icons react-loading-skeleton
   npm install zod
   npm install react-datepicker
   ```

5. **Run the dev server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

6. **Build for production**

   ```bash
   npm run build
   pm2 start npm --name momath -- run start -- -H 0.0.0.0
   ```

7. **Run for production(pm2)**

   ```bash
   pm2 start npm --name momath -- run start -- -H 0.0.0.0
   ```

> Open [http://checkinapp.math.local:3000](http://checkinapp.math.local:3000) in your browser.

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
│  ├─ event_participants/
│  │  └─ [id]/
│  │     └─ page.tsx
│  └─ api
│     ├─ auth
│     │  ├─ login/
│     │  │  └─ route.ts
│     │  └─ logout/
│     │     └─ route.ts
│     ├─ events/
│     │  └─ [...date]/
│     │     └─ route.ts
│     ├─ statusUpdate/
│     │  └─ [...data]/
│     │     └─ route.ts
│     ├─ eventParticipants/
│     │  └─ [event_id]/
│     │     └─ route.ts
│     ├─ newParticipant/
│     │  └─ route.ts
├─ components
│  ├─ Button/
│  │  ├─ Button.tsx
│  │  ├─ Button.module.css
│  │  └─ LogoutButton.tsx
│  ├─ CheckinModal.tsx
│  ├─ EventParticipantList/
│  │  └─ EventParticipantList.tsx
│  ├─ Event/
│  │  ├─ Event.tsx
│  │  ├─ EventList.tsx
│  │  ├─ Event.module.css
│  │  ├─ Filters/
│  │  │  └─ DateFilter.tsx
│  │  └─ Sort/
│  │     ├─ SortByDate.tsx
│  │     └─ SortByTitle.tsx
│  ├─ Footer/
│  │  ├─ Footer.tsx
│  │  └─ Footer.module.css
│  ├─ Highlight/
│  │  └─ Highlight.tsx
│  ├─ ParticipantDrawer.tsx
│  ├─ SearchBox/
│  │  └─ SearchBox.tsx
│  └─ ErrorMessage/
│     ├─ ErrorMessage.tsx
│     └─ ErrorMessage.module.css
├─ hooks
│  └─ useDebounce.ts
├─ services
│  ├─ events.ts
│  ├─ participants.ts
│  └─ contacts.ts
├─ schemas
│  └─ participant.ts
```

---

## App Structure Explained

### `/src`

The root for all your Next.js application code and configuration.

### `/src/app`

- **`layout.tsx`**: Wraps pages with global UI (e.g., header/footer).
- **`page.tsx`**: Home page—sets up filters, search box, and event list.
- **`loading.tsx`**: Shown while data or routes are loading.
- **`globals.css`** / **`page.module.css`**: Global and page-specific styles.
- **`event_participants/[id]/page.tsx`**: Dynamic route for participants of a given event.
- **`api/`**: Serverless routes for auth, event data, check-in, and participant creation.

### `/src/components`

Reusable UI building blocks, including:

- **`Button/`**: Primary and logout styled buttons.
- **`CheckinModal.tsx`**: Modal for manual check-in.
- **`EventParticipantList/`**: Table/list of participants with status updates.
- **`Event/`**: Event cards, lists, plus nested Filters & Sort components.
- **`Footer/`**: Site footer.
- **`Highlight/`**: Highlights search matches in titles.
- **`ParticipantDrawer.tsx`**: Slide-in form to add a new participant.
- **`SearchBox/`**: Debounced text input for title search.
- **`ErrorMessage/`**: Standardized error display.

### `/src/hooks`

- **`useDebounce.ts`**: Debounce rapid value changes (e.g., search input).

### `/src/services`

Abstracts API calls:

- **`events.ts`**: Fetch events by date.
- **`participants.ts`**: Create and fetch participants.
- **`contacts.ts`**: Create or lookup CiviCRM contacts.

### `/src/schemas`

- **`participant.ts`**: Zod schema for validating and trimming participant inputs.

### `middleware.ts`

Checks authentication cookie on every request; redirects to `/login` if unauthenticated.

---

## API Routes

| Method | Path                                | Description                            |
| ------ | ----------------------------------- | -------------------------------------- |
| POST   | `/api/auth/login`                   | Authenticate user, set session cookie  |
| POST   | `/api/auth/logout`                  | Destroy session, clear cookie          |
| GET    | `/api/events/[year]/[month]/[day]`  | Fetch events by date                   |
| GET    | `/api/eventParticipants/[event_id]` | Retrieve participants for an event     |
| POST   | `/api/statusUpdate/[id]/[status]`   | Update a participant’s check-in status |
| POST   | `/api/newParticipant`               | Create a new participant record        |

---
