import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import type { EventSearchParams } from "../../../types/event";

const SEARCH_DEBOUNCE_MS = 400;

interface EventFiltersProps {
  filters: EventSearchParams;
  cityOptions: string[];
  categoryOptions: string[];
  areOptionsLoading: boolean;
  onApply: (filters: EventSearchParams) => void;
}

export function EventFilters({
  filters,
  cityOptions,
  categoryOptions,
  areOptionsLoading,
  onApply,
}: EventFiltersProps) {
  const [draftFilters, setDraftFilters] = useState(filters);

  useEffect(() => {
    setDraftFilters(filters);
  }, [filters]);

  useEffect(() => {
    if (draftFilters.keyword === filters.keyword) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      onApply({ ...draftFilters, page: 0 });
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [draftFilters, filters.keyword, onApply]);

  function applyFilterChange(nextFilters: EventSearchParams) {
    const filtersToApply = { ...nextFilters, page: 0 };
    setDraftFilters(filtersToApply);
    onApply(filtersToApply);
  }

  function handleReset() {
    const resetFilters: EventSearchParams = {
      keyword: "",
      city: "",
      date: "",
      category: "",
      page: 0,
      size: filters.size,
    };
    applyFilterChange(resetFilters);
  }

  return (
    <div className="filter-bar">
      <label>
        <span>Search</span>
        <input
          type="search"
          value={draftFilters.keyword}
          onChange={(event) => setDraftFilters((current) => ({ ...current, keyword: event.target.value }))}
          placeholder="Artist, team, venue"
        />
      </label>

      <label>
        <span>City</span>
        <select
          value={draftFilters.city}
          onChange={(event) => applyFilterChange({ ...draftFilters, city: event.target.value })}
          disabled={areOptionsLoading}
        >
          <option value="">{areOptionsLoading ? "Loading cities..." : "Any city"}</option>
          {cityOptions.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Date</span>
        <input
          type="date"
          value={draftFilters.date}
          onChange={(event) => applyFilterChange({ ...draftFilters, date: event.target.value })}
        />
      </label>

      <label>
        <span>Category</span>
        <select
          value={draftFilters.category}
          onChange={(event) => applyFilterChange({ ...draftFilters, category: event.target.value })}
          disabled={areOptionsLoading}
        >
          <option value="">{areOptionsLoading ? "Loading categories..." : "Any category"}</option>
          {categoryOptions.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <div className="filter-actions">
        <button className="secondary-button icon-only" type="button" onClick={handleReset} aria-label="Reset filters">
          <RotateCcw size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
