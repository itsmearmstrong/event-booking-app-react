export interface Booking {
  id: string;
  eventId: string;
  eventName: string;
  eventDate: string;
  eventVenue: string;
  eventImageUrl: string;
  customerName: string;
  customerEmail: string;
  tickets: number;
  createdAt: string;
}

export interface CreateBookingInput {
  eventId: string;
  eventName: string;
  eventDate: string;
  eventVenue: string;
  eventImageUrl: string;
  customerName: string;
  customerEmail: string;
  tickets: number;
}
