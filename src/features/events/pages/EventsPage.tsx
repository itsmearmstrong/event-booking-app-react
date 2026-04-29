import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { CalendarSearch, RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { EventSearchParams } from "../../../types/event";
import { fetchEventFilterOptions, fetchEvents } from "../api/ticketmaster";
import { EventCard } from "../components/EventCard";
import { EventFilters } from "../components/EventFilters";
import { PaginationControls } from "../components/PaginationControls";

const initialFilters: EventSearchParams = {
  keyword: "",
  city: "",
  date: "",
  category: "",
  page: 0,
  size: 12,
};

export function EventsPage() {
  const [filters, setFilters] = useState<EventSearchParams>(initialFilters);
  const hasMountedRef = useRef(false);
  const cityOptionsQuery = useQuery({
    queryKey: ["event-city-options", filters.keyword, filters.date, filters.category],
    queryFn: () => fetchEventFilterOptions(filters, ["city"]),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 30,
  });
  const categoryOptionsQuery = useQuery({
    queryKey: ["event-category-options", filters.keyword, filters.date, filters.city],
    queryFn: () => fetchEventFilterOptions(filters, ["category"]),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 30,
  });
  const eventsQuery = useQuery({
    queryKey: ["events", filters],
    queryFn: () => fetchEvents(filters),
  });

  function handlePageChange(page: number) {
    setFilters((current) => ({ ...current, page }));
  }

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [filters.page]);

  return (
    <section className="content-section">
      <div className="page-heading">
        <div>
          <div className="section-kicker">Discover</div>
          <h1>Events dashboard</h1>
        </div>
      </div>

      <EventFilters
        filters={filters}
        cityOptions={cityOptionsQuery.data?.cities ?? []}
        categoryOptions={categoryOptionsQuery.data?.categories ?? []}
        areOptionsLoading={cityOptionsQuery.isLoading || categoryOptionsQuery.isLoading}
        onApply={setFilters}
      />

      {eventsQuery.isLoading ? (
        <div className="events-grid" aria-label="Loading events">
          {Array.from({ length: 8 }, (_, index) => (
            <div className="event-card skeleton-card" key={index} />
          ))}
        </div>
      ) : null}

      {eventsQuery.isError ? (
        <div className="empty-state" role="alert">
          <RefreshCw size={34} aria-hidden="true" />
          <h2>Events could not be loaded</h2>
          <p>{eventsQuery.error.message}</p>
          <button className="primary-button" type="button" onClick={() => void eventsQuery.refetch()}>
            <RefreshCw size={18} aria-hidden="true" />
            Try again
          </button>
        </div>
      ) : null}

      {eventsQuery.data && eventsQuery.data.events.length === 0 ? (
        <div className="empty-state">
          <CalendarSearch size={34} aria-hidden="true" />
          <h2>No matching events</h2>
          <p>Try a different keyword, city, date, or category.</p>
        </div>
      ) : null}

      {eventsQuery.data && eventsQuery.data.events.length > 0 ? (
        <>
          <div className="events-grid">
            {eventsQuery.data.events.map((event) => (
              <EventCard event={event} key={event.id} />
            ))}
          </div>
          <PaginationControls
            page={eventsQuery.data.page}
            totalPages={eventsQuery.data.totalPages}
            totalElements={eventsQuery.data.totalElements}
            onPageChange={handlePageChange}
          />
        </>
      ) : null}
    </section>
  );
}
