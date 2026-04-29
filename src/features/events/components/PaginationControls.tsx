import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
}

export function PaginationControls({ page, totalPages, totalElements, onPageChange }: PaginationControlsProps) {
  return (
    <div className="pagination-bar">
      <p>
        Page {page + 1} of {totalPages} · {totalElements} event(s)
      </p>
      <div className="pagination-actions">
        <button className="secondary-button" type="button" onClick={() => onPageChange(page - 1)} disabled={page === 0}>
          <ChevronLeft size={18} aria-hidden="true" />
          Previous
        </button>
        <button
          className="secondary-button"
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page + 1 >= totalPages}
        >
          Next
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
