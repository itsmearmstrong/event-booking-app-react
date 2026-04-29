import { createContext, type PropsWithChildren, useContext, useMemo, useState } from "react";
import { createId } from "../../lib/id";
import { readStorage, writeStorage } from "../../lib/storage";
import type { Booking, CreateBookingInput } from "../../types/booking";

const BOOKINGS_STORAGE_KEY = "event-booking-bookings";

interface BookingsContextValue {
  bookings: Booking[];
  addBooking: (input: CreateBookingInput) => Booking;
  cancelBooking: (bookingId: string) => void;
}

const BookingsContext = createContext<BookingsContextValue | undefined>(undefined);

export function BookingsProvider({ children }: PropsWithChildren) {
  const [bookings, setBookings] = useState<Booking[]>(() => readStorage<Booking[]>(BOOKINGS_STORAGE_KEY, []));

  const value = useMemo<BookingsContextValue>(
    () => ({
      bookings,
      addBooking: (input: CreateBookingInput) => {
        const booking: Booking = {
          ...input,
          id: createId("booking"),
          createdAt: new Date().toISOString(),
        };

        setBookings((current) => {
          const nextBookings = [booking, ...current];
          writeStorage(BOOKINGS_STORAGE_KEY, nextBookings);
          return nextBookings;
        });

        return booking;
      },
      cancelBooking: (bookingId: string) => {
        setBookings((current) => {
          const nextBookings = current.filter((booking) => booking.id !== bookingId);
          writeStorage(BOOKINGS_STORAGE_KEY, nextBookings);
          return nextBookings;
        });
      },
    }),
    [bookings],
  );

  return <BookingsContext.Provider value={value}>{children}</BookingsContext.Provider>;
}

export function useBookings(): BookingsContextValue {
  const context = useContext(BookingsContext);

  if (!context) {
    throw new Error("useBookings must be used inside BookingsProvider");
  }

  return context;
}
