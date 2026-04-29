# Event Booking App Spec

## Requirement description
Build a protected React application where users can browse events from the Ticketmaster Discovery API, search and filter event results, inspect event details, complete a local ticket booking, and manage their saved bookings.

## Acceptance criteria
- Users can log in from `/login` with email and password and stay logged in after refresh.
- Protected routes redirect unauthenticated users to `/login`.
- `/events` shows a dashboard of events with name, date, venue, and image.
- Users can search by keyword and filter by API-provided city options, date, and API-provided category options.
- Keyword search applies automatically after the user pauses typing for 400ms.
- City and category dropdown options refresh based on the other active filters while still allowing each filter to work independently.
- The events page shows loading, empty, and error states and supports pagination.
- `/events/:id` shows event title, date/time, venue details, description, image/banner, and a Book Now action.
- Users can submit a booking form with required name, valid email, and ticket count from 1 to 10.
- Submitted bookings are saved in app state and `localStorage`.
- `/bookings` lists saved bookings and allows cancellation.
- Users can toggle light and dark themes; preference persists and defaults to system color scheme.

## Architectural design
- App composition lives in `src/app/App.tsx` with providers for router, query cache, auth, and bookings.
- Route protection is handled by `src/features/auth/ProtectedRoute.tsx`.
- Ticketmaster integration is isolated in `src/features/events/api/ticketmaster.ts` and returns normalized app event types.
- City and category filter options are loaded from Ticketmaster event data and rendered as dependent dropdowns.
- Auth and bookings use focused Context providers that hydrate from and persist to `localStorage`.
- Theme state is provided by Context and applies via `data-theme` CSS variables on the document root.
- Pages remain thin orchestration layers; reusable UI lives near the feature that owns it.

## Implementation plan
- [x] Scaffold React/Vite TypeScript project dependencies and config.
- [x] Add `project.md` and this feature spec.
- [x] Define shared domain types, storage helpers, and date formatting utilities.
- [x] Implement auth provider, login page, logout, and protected routes.
- [x] Implement Ticketmaster API adapter.
- [x] Implement events listing page with search, filters, pagination, and states.
- [x] Implement event detail page and booking entry point.
- [x] Implement booking validation, persistence, listing, and cancellation.
- [x] Add responsive styling for all required views.
- [x] Verify with a production build.
