import type { Category, ReportFilterState } from '../types/inventory'

interface ReportPanelProps {
  filters: ReportFilterState
  categories: Category[]
  onChangeFilters: (next: ReportFilterState) => void
  onRunReport: () => void
  onClose: () => void
}

export default function ReportPanel({
  filters,
  categories,
  onChangeFilters,
  onRunReport,
  onClose,
}: ReportPanelProps) {
  return (
    <section className="panel">
      <h2>Filter Components</h2>
      <div className="form-grid form-grid-compact">
        <label htmlFor="report-min-qty">Min Qty</label>
        <input
          id="report-min-qty"
          type="number"
          min={0}
          value={filters.minQty}
          onChange={(event) => onChangeFilters({ ...filters, minQty: event.target.value })}
        />

        <label htmlFor="report-max-qty">Max Qty</label>
        <input
          id="report-max-qty"
          type="number"
          min={0}
          value={filters.maxQty}
          onChange={(event) => onChangeFilters({ ...filters, maxQty: event.target.value })}
        />

        <label htmlFor="report-min-price">Min Price</label>
        <input
          id="report-min-price"
          type="number"
          min={0}
          step="0.01"
          value={filters.minPrice}
          onChange={(event) => onChangeFilters({ ...filters, minPrice: event.target.value })}
        />

        <label htmlFor="report-max-price">Max Price</label>
        <input
          id="report-max-price"
          type="number"
          min={0}
          step="0.01"
          value={filters.maxPrice}
          onChange={(event) => onChangeFilters({ ...filters, maxPrice: event.target.value })}
        />

        <label htmlFor="report-category">Category</label>
        <select
          id="report-category"
          value={filters.categoryId}
          onChange={(event) => onChangeFilters({ ...filters, categoryId: event.target.value })}
        >
          <option value="">-- Any Category --</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-actions">
        <button type="button" onClick={onRunReport}>
          Apply Filter
        </button>
        <button type="button" className="button-muted" onClick={onClose}>
          Cancel
        </button>
      </div>
    </section>
  )
}
