import { CalendarDays, MapPin, Ticket, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { formatBookingDate, formatEventDate } from "../../lib/format";
import { useBookings } from "./BookingsContext";

export function BookingsPage() {
  const { bookings, cancelBooking } = useBookings();

  return (
    <section className="content-section">
      <div className="page-heading">
        <div>
          <div className="section-kicker">My bookings</div>
          <h1>Saved reservations</h1>
        </div>
        <Link className="secondary-button" to="/events">
          <CalendarDays size={18} aria-hidden="true" />
          Browse events
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <Ticket size={34} aria-hidden="true" />
          <h2>No bookings yet</h2>
          <p>Events you book will appear here with cancellation controls.</p>
          <Link className="primary-button" to="/events">
            <CalendarDays size={18} aria-hidden="true" />
            Find events
          </Link>
        </div>
      ) : (
        <div className="booking-list">
          {bookings.map((booking) => (
            <article className="booking-card" key={booking.id}>
              <img src={booking.eventImageUrl} alt="" />
              <div className="booking-card-body">
                <div>
                  <h2>{booking.eventName}</h2>
                  <p className="meta-line">
                    <CalendarDays size={16} aria-hidden="true" />
                    {formatEventDate(booking.eventDate)}
                  </p>
                  <p className="meta-line">
                    <MapPin size={16} aria-hidden="true" />
                    {booking.eventVenue}
                  </p>
                </div>

                <div className="booking-card-footer">
                  <div>
                    <span className="ticket-count">{booking.tickets} ticket(s)</span>
                    <p className="muted">Booked {formatBookingDate(booking.createdAt)}</p>
                  </div>
                  <button className="danger-button" type="button" onClick={() => cancelBooking(booking.id)}>
                    <Trash2 size={18} aria-hidden="true" />
                    Cancel
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
