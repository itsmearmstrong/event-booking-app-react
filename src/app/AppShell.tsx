import { CalendarDays, LogOut, Ticket } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import { useBookings } from "../features/bookings/BookingsContext";
import { ThemeToggleButton } from "../features/theme/ThemeToggleButton";

export function AppShell() {
  const { user, logout } = useAuth();
  const { bookings } = useBookings();

  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink to="/events" className="brand" aria-label="Event Booking App">
          <Ticket size={24} aria-hidden="true" />
          <span>EventFlow</span>
        </NavLink>

        <nav className="main-nav" aria-label="Primary">
          <NavLink to="/events">
            <CalendarDays size={18} aria-hidden="true" />
            Events
          </NavLink>
          <NavLink to="/bookings">
            <Ticket size={18} aria-hidden="true" />
            Bookings
            {bookings.length > 0 ? <span className="nav-count">{bookings.length}</span> : null}
          </NavLink>
        </nav>

        <div className="account-bar">
          <ThemeToggleButton />
          <span>{user?.email}</span>
          <button className="icon-button" type="button" onClick={logout} aria-label="Log out">
            <LogOut size={18} aria-hidden="true" />
          </button>
        </div>
      </header>

      <main className="page-frame">
        <Outlet />
      </main>
    </div>
  );
}
