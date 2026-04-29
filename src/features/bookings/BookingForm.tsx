import { useState, type FormEvent } from "react";
import { CheckCircle2, Mail, Minus, Plus, User } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import type { EventDetails } from "../../types/event";
import type { Booking } from "../../types/booking";
import { useBookings } from "./BookingsContext";

interface BookingFormProps {
  event: EventDetails;
  titleId?: string;
  onSuccess: (booking: Booking) => void;
}

interface BookingErrors {
  name?: string;
  email?: string;
  tickets?: string;
}

export function BookingForm({ event, titleId, onSuccess }: BookingFormProps) {
  const { user } = useAuth();
  const { addBooking } = useBookings();
  const [name, setName] = useState("");
  const [email, setEmail] = useState(user?.email ?? "");
  const [tickets, setTickets] = useState(1);
  const [errors, setErrors] = useState<BookingErrors>({});

  function validate(): BookingErrors {
    const nextErrors: BookingErrors = {};

    if (!name.trim()) {
      nextErrors.name = "Name is required.";
    }

    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (tickets < 1 || tickets > 10) {
      nextErrors.tickets = "Choose between 1 and 10 tickets.";
    }

    return nextErrors;
  }

  function handleSubmit(formEvent: FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const booking = addBooking({
      eventId: event.id,
      eventName: event.name,
      eventDate: event.date,
      eventVenue: `${event.venueName}, ${event.venueCity}`,
      eventImageUrl: event.imageUrl,
      customerName: name.trim(),
      customerEmail: email.trim(),
      tickets,
    });

    onSuccess(booking);
  }

  function adjustTickets(nextValue: number) {
    setTickets(Math.min(10, Math.max(1, nextValue)));
  }

  return (
    <div className="booking-panel">
      <div className="panel-heading">
        <div>
          <div className="section-kicker">Booking</div>
          <h2 id={titleId}>Reserve tickets</h2>
        </div>
        <span className="limit-pill">Max 10</span>
      </div>

      <form className="form-stack" onSubmit={handleSubmit} noValidate>
        <label>
          <span>Name</span>
          <div className="input-with-icon">
            <User size={18} aria-hidden="true" />
            <input value={name} onChange={(formEvent) => setName(formEvent.target.value)} placeholder="Full name" />
          </div>
          {errors.name ? <small className="field-error">{errors.name}</small> : null}
        </label>

        <label>
          <span>Email</span>
          <div className="input-with-icon">
            <Mail size={18} aria-hidden="true" />
            <input
              type="email"
              value={email}
              onChange={(formEvent) => setEmail(formEvent.target.value)}
              placeholder="you@example.com"
            />
          </div>
          {errors.email ? <small className="field-error">{errors.email}</small> : null}
        </label>

        <label>
          <span>Tickets</span>
          <div className="stepper">
            <button type="button" onClick={() => adjustTickets(tickets - 1)} aria-label="Decrease tickets">
              <Minus size={16} aria-hidden="true" />
            </button>
            <input
              type="number"
              min={1}
              max={10}
              value={tickets}
              onChange={(formEvent) => adjustTickets(Number(formEvent.target.value))}
              aria-label="Number of tickets"
            />
            <button type="button" onClick={() => adjustTickets(tickets + 1)} aria-label="Increase tickets">
              <Plus size={16} aria-hidden="true" />
            </button>
          </div>
          {errors.tickets ? <small className="field-error">{errors.tickets}</small> : null}
        </label>

        <button className="primary-button full-width" type="submit">
          <CheckCircle2 size={18} aria-hidden="true" />
          Confirm booking
        </button>
      </form>
    </div>
  );
}
