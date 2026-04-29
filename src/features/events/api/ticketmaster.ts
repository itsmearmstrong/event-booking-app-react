import type {
  EventDetails,
  EventFilterOptions,
  EventSearchParams,
  EventSearchResponse,
  EventSummary,
  EventVenue,
} from "../../../types/event";

const API_BASE_URL = "https://app.ticketmaster.com/discovery/v2";
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80";

interface TicketmasterImage {
  url: string;
  ratio?: string;
  width?: number;
}

interface TicketmasterVenue {
  name?: string;
  address?: {
    line1?: string;
  };
  city?: {
    name?: string;
  };
  state?: {
    name?: string;
    stateCode?: string;
  };
  country?: {
    name?: string;
  };
}

interface TicketmasterEvent {
  id: string;
  name: string;
  info?: string;
  pleaseNote?: string;
  url?: string;
  images?: TicketmasterImage[];
  dates?: {
    start?: {
      localDate?: string;
      localTime?: string;
    };
  };
  classifications?: Array<{
    segment?: {
      name?: string;
    };
  }>;
  _embedded?: {
    venues?: TicketmasterVenue[];
  };
}

interface TicketmasterEventsResponse {
  _embedded?: {
    events?: TicketmasterEvent[];
  };
  page?: {
    size?: number;
    totalElements?: number;
    totalPages?: number;
    number?: number;
  };
}

type FilterKey = keyof Pick<EventSearchParams, "keyword" | "city" | "date" | "category">;

export async function fetchEventFilterOptions(
  params: EventSearchParams,
  omittedFilters: FilterKey[] = [],
): Promise<EventFilterOptions> {
  const url = new URL(`${API_BASE_URL}/events.json`);
  url.searchParams.set("apikey", getApiKey());
  url.searchParams.set("size", "200");
  url.searchParams.set("page", "0");
  url.searchParams.set("sort", "date,asc");
  url.searchParams.set("countryCode", "US");
  appendEventSearchFilters(url, params, omittedFilters);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to load filter options from Ticketmaster.");
  }

  const data = (await response.json()) as TicketmasterEventsResponse;
  const cityNames = new Set<string>();
  const categoryNames = new Set<string>();

  for (const event of data._embedded?.events ?? []) {
    const city = event._embedded?.venues?.[0]?.city?.name?.trim();
    const category = event.classifications?.[0]?.segment?.name?.trim();

    if (city) {
      cityNames.add(city);
    }

    if (category) {
      categoryNames.add(category);
    }
  }

  return {
    cities: sortValues(cityNames),
    categories: sortValues(categoryNames),
  };
}

export async function fetchEvents(params: EventSearchParams): Promise<EventSearchResponse> {
  const apiKey = getApiKey();

  const url = new URL(`${API_BASE_URL}/events.json`);
  url.searchParams.set("apikey", apiKey);
  url.searchParams.set("size", String(params.size));
  url.searchParams.set("page", String(params.page));
  url.searchParams.set("sort", "date,asc");
  url.searchParams.set("countryCode", "US");
  appendEventSearchFilters(url, params);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to load events from Ticketmaster.");
  }

  const data = (await response.json()) as TicketmasterEventsResponse;

  return {
    events: data._embedded?.events?.map(mapEventSummary) ?? [],
    page: data.page?.number ?? params.page,
    pageSize: data.page?.size ?? params.size,
    totalPages: Math.max(1, data.page?.totalPages ?? 1),
    totalElements: data.page?.totalElements ?? 0,
  };
}

function appendEventSearchFilters(url: URL, params: EventSearchParams, omittedFilters: FilterKey[] = []): void {
  const omittedFilterSet = new Set<FilterKey>(omittedFilters);

  if (!omittedFilterSet.has("keyword") && params.keyword.trim()) {
    url.searchParams.set("keyword", params.keyword.trim());
  }

  if (!omittedFilterSet.has("city") && params.city.trim()) {
    url.searchParams.set("city", params.city.trim());
  }

  if (!omittedFilterSet.has("category") && params.category.trim()) {
    url.searchParams.set("classificationName", params.category.trim());
  }

  if (!omittedFilterSet.has("date") && params.date) {
    url.searchParams.set("startDateTime", `${params.date}T00:00:00Z`);
    url.searchParams.set("endDateTime", `${params.date}T23:59:59Z`);
  }
}

function sortValues(values: Set<string>): string[] {
  return [...values].sort((left, right) => left.localeCompare(right));
}

export async function fetchEventById(id: string): Promise<EventDetails> {
  const url = new URL(`${API_BASE_URL}/events/${id}.json`);
  url.searchParams.set("apikey", getApiKey());

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to load event details.");
  }

  return mapEventDetails((await response.json()) as TicketmasterEvent);
}

function getApiKey(): string {
  const apiKey = import.meta.env.VITE_TICKETMASTER_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("Ticketmaster API key is not configured. Add VITE_TICKETMASTER_API_KEY to .env.local.");
  }

  return apiKey;
}

function mapEventSummary(event: TicketmasterEvent): EventSummary {
  const venue = getVenue(event);

  return {
    id: event.id,
    name: event.name,
    date: event.dates?.start?.localDate ?? "",
    time: event.dates?.start?.localTime,
    venueName: venue.name,
    venueCity: venue.city,
    imageUrl: pickImage(event.images),
    category: event.classifications?.[0]?.segment?.name,
  };
}

function mapEventDetails(event: TicketmasterEvent): EventDetails {
  const summary = mapEventSummary(event);
  const venue = getVenue(event);

  return {
    ...summary,
    description: event.info ?? event.pleaseNote ?? `${event.name} is available for booking through Ticketmaster.`,
    url: event.url,
    venue,
  };
}

function pickImage(images?: TicketmasterImage[]): string {
  const sortedImages = [...(images ?? [])]
    .filter((image) => image.url)
    .sort((left, right) => {
      const leftScore = (left.ratio === "16_9" ? 10000 : 0) + (left.width ?? 0);
      const rightScore = (right.ratio === "16_9" ? 10000 : 0) + (right.width ?? 0);
      return rightScore - leftScore;
    });

  return sortedImages[0]?.url ?? FALLBACK_IMAGE;
}

function getVenue(event: TicketmasterEvent): EventVenue {
  const venue = event._embedded?.venues?.[0];
  const city = venue?.city?.name ?? "City to be announced";
  const state = venue?.state?.stateCode ?? venue?.state?.name;

  return {
    name: venue?.name ?? "Venue to be announced",
    address: venue?.address?.line1 ?? "Address to be announced",
    city,
    state,
    country: venue?.country?.name,
  };
}
