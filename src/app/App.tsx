import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./AppShell";
import { AuthProvider } from "../features/auth/AuthContext";
import { LoginPage } from "../features/auth/LoginPage";
import { ProtectedRoute } from "../features/auth/ProtectedRoute";
import { BookingsProvider } from "../features/bookings/BookingsContext";
import { BookingsPage } from "../features/bookings/BookingsPage";
import { EventDetailsPage } from "../features/events/pages/EventDetailsPage";
import { EventsPage } from "../features/events/pages/EventsPage";
import { ThemeProvider } from "../features/theme/ThemeContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BookingsProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route element={<ProtectedRoute />}>
                  <Route element={<AppShell />}>
                    <Route path="/" element={<Navigate to="/events" replace />} />
                    <Route path="/events" element={<EventsPage />} />
                    <Route path="/events/:id" element={<EventDetailsPage />} />
                    <Route path="/bookings" element={<BookingsPage />} />
                  </Route>
                </Route>
                <Route path="*" element={<Navigate to="/events" replace />} />
              </Routes>
            </BrowserRouter>
          </BookingsProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
