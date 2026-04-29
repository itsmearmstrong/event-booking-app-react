import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CalendarDays, CheckCircle2, ExternalLink, MapPin, Ticket, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BookingForm } from "../../bookings/BookingForm";
import { formatEventDate, formatEventTime } from "../../../lib/format";
import { fetchEventById } from "../api/ticketmaster";

export function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const bookingModalTitleId = "booking-modal-title";
  const eventQuery = useQuery({
    queryKey: ["event", id],
    queryFn: () => fetchEventById(id ?? ""),
    enabled: Boolean(id),
  });

  useEffect(() => {
    if (!showBookingForm) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setShowBookingForm(false);
      }
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showBookingForm]);

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => setToastMessage(""), 3600);
    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  if (eventQuery.isLoading) {
    return (
      <section className="content-section">
        <div className="detail-skeleton" aria-label="Loading event details" />
      </section>
    );
  }

  if (eventQuery.isError || !eventQuery.data) {
    return (
      <section className="content-section">
        <div className="empty-state" role="alert">
          <Ticket size={34} aria-hidden="true" />
          <h2>Event details unavailable</h2>
          <p>{eventQuery.error?.message ?? "The selected event could not be found."}</p>
          <Link className="primary-button" to="/events">
            <ArrowLeft size={18} aria-hidden="true" />
            Back to events
          </Link>
        </div>
      </section>
    );
  }

  const event = eventQuery.data;

  return (
    <section className="content-section detail-section">
      <Link className="text-link" to="/events">
        <ArrowLeft size={18} aria-hidden="true" />
        Back to events
      </Link>

      {toastMessage ? (
        <div className="toast" role="status" aria-live="polite">
          <CheckCircle2 size={20} aria-hidden="true" />
          <span>{toastMessage}</span>
        </div>
      ) : null}

      <article className="event-detail">
        <div className="detail-hero">
          <img src={event.imageUrl} alt="" />
          {event.category ? <span>{event.category}</span> : null}
        </div>

        <div className="detail-body">
          <div className="detail-main">
            <div className="section-kicker">Event details</div>
            <h1>{event.name}</h1>
            <div className="detail-meta-grid">
              <p className="meta-line">
                <CalendarDays size={18} aria-hidden="true" />
                {formatEventDate(event.date)} at {formatEventTime(event.time)}
              </p>
              <p className="meta-line">
                <MapPin size={18} aria-hidden="true" />
                {event.venue.name}, {event.venue.city}
              </p>
            </div>

            <p className="event-description">{event.description}</p>

            <div className="venue-box">
              <h2>Venue</h2>
              <p>{event.venue.name}</p>
              <p>
                {event.venue.address}, {event.venue.city}
                {event.venue.state ? `, ${event.venue.state}` : ""}
              </p>
            </div>
          </div>

          <aside className="detail-aside">
            <button className="primary-button full-width" type="button" onClick={() => setShowBookingForm(true)}>
              <Ticket size={18} aria-hidden="true" />
              Book now
            </button>
            {event.url ? (
              <a className="secondary-button full-width" href={event.url} target="_blank" rel="noreferrer">
                <ExternalLink size={18} aria-hidden="true" />
                Ticketmaster
              </a>
            ) : null}
          </aside>
        </div>
      </article>

      {showBookingForm ? (
        <div
          className="modal-backdrop"
          onMouseDown={(mouseEvent) => {
            if (mouseEvent.target === mouseEvent.currentTarget) {
              setShowBookingForm(false);
            }
          }}
        >
          <div className="booking-modal" role="dialog" aria-modal="true" aria-labelledby={bookingModalTitleId}>
            <button
              className="icon-button modal-close"
              type="button"
              onClick={() => setShowBookingForm(false)}
              aria-label="Close booking form"
            >
              <X size={18} aria-hidden="true" />
            </button>
            <BookingForm
              event={event}
              titleId={bookingModalTitleId}
              onSuccess={(booking) => {
                setShowBookingForm(false);
                setToastMessage(
                  `Booking confirmed for ${booking.tickets} ${booking.tickets === 1 ? "ticket" : "tickets"}.`,
                );
              }}
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
