# Event Booking App

## General description
This is a React event booking application based on the assignment PDF. Authenticated users can browse Ticketmaster events, search and filter them, view details, book tickets through a local booking flow, and manage saved bookings.

## Functionalities
- Authentication: email/password login, persisted auth state, protected app routes, and logout.
- Event listing: event cards with image, name, date, and venue, plus loading and error states.
- Search and filters: keyword search, API-driven city and category dropdowns, date filter, dynamic dependent options, and paginated results.
- Event details: detail view with banner, date/time, venue metadata, description, and booking entry point.
- Ticket booking: validated name/email/ticket-count form, local persistence, and success feedback.
- My bookings: persisted list of bookings with event name, date, ticket count, and cancel action.
- Theme: global light/dark mode with persisted preference and system preference default.

## Tech stack
- React 19 with TypeScript
- Vite
- React Router
- TanStack Query for API state
- React Context for auth and booking state
- React Context for theme state
- Global CSS organized under `src/styles/global.css`
- Ticketmaster Discovery API using `VITE_TICKETMASTER_API_KEY`

## File structure
- `docs/specs/`: spec-driven feature documents and implementation checklist
- `src/app/`: application composition and shell layout
- `src/features/auth/`: login, auth context, and protected route
- `src/features/events/`: Ticketmaster API adapter, event list/detail pages, event components
- `src/features/bookings/`: booking context, booking form, bookings page
- `src/features/theme/`: theme context, custom hook, and toggle button
- `src/lib/`: shared storage, formatting, and utility helpers
- `src/types/`: shared domain types
- `src/styles/`: application styling

## Agent workflow
At the start of a coding session, read this file and the active spec in `docs/specs/`. Keep changes aligned with the feature requirements, update spec checklists when tasks are completed, and verify with `npm run build` before delivery.
