import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { formatEventDate } from "../../../lib/format";
import type { EventSummary } from "../../../types/event";

interface EventCardProps {
  event: EventSummary;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Link className="event-card" to={`/events/${event.id}`}>
      <div className="event-card-image">
        <img src={event.imageUrl} alt="" loading="lazy" />
        {event.category ? <span>{event.category}</span> : null}
      </div>
      <div className="event-card-body">
        <h2>{event.name}</h2>
        <p className="meta-line">
          <CalendarDays size={16} aria-hidden="true" />
          {formatEventDate(event.date)}
        </p>
        <p className="meta-line">
          <MapPin size={16} aria-hidden="true" />
          {event.venueName}, {event.venueCity}
        </p>
        <span className="card-link">
          View details
          <ArrowRight size={16} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
