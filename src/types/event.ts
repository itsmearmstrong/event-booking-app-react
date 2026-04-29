export interface EventVenue {
  name: string;
  address: string;
  city: string;
  state?: string;
  country?: string;
}

export interface EventSummary {
  id: string;
  name: string;
  date: string;
  time?: string;
  venueName: string;
  venueCity: string;
  imageUrl: string;
  category?: string;
}

export interface EventDetails extends EventSummary {
  description: string;
  url?: string;
  venue: EventVenue;
}

export interface EventSearchParams {
  keyword: string;
  city: string;
  date: string;
  category: string;
  page: number;
  size: number;
}

export interface EventSearchResponse {
  events: EventSummary[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
}

export interface EventFilterOptions {
  cities: string[];
  categories: string[];
}
